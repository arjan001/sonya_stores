import { NextRequest, NextResponse } from "next/server"
import { rateLimit, rateLimitResponse, validateUpload } from "@/lib/security"

export async function POST(request: NextRequest) {
  // Rate limit: max 10 uploads per minute
  const rl = rateLimit(request, { limit: 10, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size (max 5MB, images only)
    const validation = validateUpload(file, 5)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // For now, return a placeholder URL
    // In production, you would upload to a service like Vercel Blob, S3, or Cloudinary
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({ success: true, url: fileUrl })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

    // Sanitize folder name
    const folder = (productSlug || "general").replace(/[^a-z0-9\-]/gi, "").slice(0, 100)
    const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg"
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage
      .from("products")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("Upload error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error("Upload failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
