"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AdminShell } from "./admin-shell"
import { Save, Loader2, Eye, FileText, Search, ChevronRight, Bold, Italic, Underline, List, ListOrdered, Link2, Heading2, Undo2, Redo2, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Policy {
  id: string
  slug: string
  title: string
  content: string
  meta_title: string
  meta_description: string
  meta_keywords: string
  last_updated: string
  updated_by: string
}

const TOOLBAR_ACTIONS = [
  { cmd: "bold", icon: Bold, label: "Bold" },
  { cmd: "italic", icon: Italic, label: "Italic" },
  { cmd: "underline", icon: Underline, label: "Underline" },
  { cmd: "divider" as const },
  { cmd: "formatBlock:h2", icon: Heading2, label: "Heading" },
  { cmd: "insertUnorderedList", icon: List, label: "Bullet List" },
  { cmd: "insertOrderedList", icon: ListOrdered, label: "Numbered List" },
  { cmd: "divider" as const },
  { cmd: "createLink", icon: Link2, label: "Link" },
  { cmd: "removeFormat", icon: Code, label: "Clear Format" },
]

function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInternalUpdate = useRef(false)

  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      editorRef.current.innerHTML = value
    }
    isInternalUpdate.current = false
  }, [value])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalUpdate.current = true
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const execCmd = (cmdStr: string) => {
    if (cmdStr.startsWith("formatBlock:")) {
      document.execCommand("formatBlock", false, `<${cmdStr.split(":")[1]}>`)
    } else if (cmdStr === "createLink") {
      const url = prompt("Enter URL:")
      if (url) document.execCommand("createLink", false, url)
    } else {
      document.execCommand(cmdStr, false)
    }
    editorRef.current?.focus()
    handleInput()
  }

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-secondary/50 border-b border-border">
        {TOOLBAR_ACTIONS.map((action, i) => {
          if (action.cmd === "divider") {
            return <div key={`d-${i}`} className="w-px h-5 bg-border mx-1" />
          }
          const Icon = action.icon!
          return (
            <button
              key={action.cmd}
              type="button"
              onClick={() => execCmd(action.cmd)}
              className="p-1.5 rounded-sm hover:bg-secondary transition-colors"
              title={action.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
        <div className="w-px h-5 bg-border mx-1" />
        <button
          type="button"
          onClick={() => document.execCommand("undo")}
          className="p-1.5 rounded-sm hover:bg-secondary transition-colors"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => document.execCommand("redo")}
          className="p-1.5 rounded-sm hover:bg-secondary transition-colors"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 text-sm leading-relaxed focus:outline-none prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-semibold prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground prose-a:underline prose-ul:list-disc prose-ul:pl-5"
      />
    </div>
  )
}

export function AdminPolicies() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [selected, setSelected] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Editable fields
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDesc, setMetaDesc] = useState("")
  const [metaKeywords, setMetaKeywords] = useState("")

  useEffect(() => {
    fetch("/api/policies")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPolicies(data)
          if (data.length > 0) selectPolicy(data[0])
        }
      })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectPolicy = (p: Policy) => {
    setSelected(p)
    setTitle(p.title)
    setContent(p.content)
    setMetaTitle(p.meta_title || "")
    setMetaDesc(p.meta_description || "")
    setMetaKeywords(p.meta_keywords || "")
    setShowPreview(false)
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/policies/${selected.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          meta_title: metaTitle,
          meta_description: metaDesc,
          meta_keywords: metaKeywords,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setPolicies((prev) => prev.map((p) => (p.slug === selected.slug ? updated : p)))
        setSelected(updated)
        toast.success("Policy saved successfully")
      } else {
        toast.error("Failed to save policy")
      }
    } catch {
      toast.error("Error saving policy")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Policies">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Policies">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold">Policies</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your store policies. Changes are live on the website immediately.</p>
      </div>
      {/* Policy tabs */}
      <div className="flex flex-wrap gap-2">
        {policies.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => selectPolicy(p)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm border transition-colors ${
              selected?.slug === p.slug
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            {p.title}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-6">
          {/* Header bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold">{selected.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                /{selected.slug} -- Last saved: {selected.last_updated ? new Date(selected.last_updated).toLocaleString() : "Never"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="bg-transparent"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                {showPreview ? "Edit" : "Preview"}
              </Button>
              <a
                href={`/${selected.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View Page <ChevronRight className="h-3 w-3" />
              </a>
              <Button onClick={handleSave} disabled={saving} size="sm">
                {saving ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* SEO fields */}
          <div className="border border-border rounded-sm p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">SEO Metadata</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1 block">Page Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block">Meta Title (SEO)</Label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="h-9 text-sm"
                  placeholder="Title shown in search results"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium mb-1 block">Meta Description</Label>
              <Textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                rows={2}
                className="text-sm"
                placeholder="Description shown in search results (150-160 chars)"
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">{metaDesc.length}/160 characters</p>
            </div>

            <div>
              <Label className="text-xs font-medium mb-1 block">Meta Keywords (comma-separated)</Label>
              <Input
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className="h-9 text-sm"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>

          {/* Content editor / preview */}
          {showPreview ? (
            <div className="border border-border rounded-sm">
              <div className="px-4 py-2 border-b border-border bg-secondary/30">
                <p className="text-xs font-medium text-muted-foreground">Preview</p>
              </div>
              <div
                className="p-6 prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-semibold prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground prose-a:underline prose-ul:list-disc prose-ul:pl-5"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <div>
              <Label className="text-xs font-medium mb-2 block">Content (Rich Text)</Label>
              <RichEditor value={content} onChange={setContent} />
            </div>
          )}
        </div>
      )}
    </div>
    </AdminShell>
  )
}
