'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  email: string
  name?: string
  role: string
}

export function UsersModule() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('[v0] Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="text-center py-8">Loading users...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users & Roles</h1>
        <Button className="bg-foreground text-background">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-4">Email</th>
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Role</th>
              <th className="text-right py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-secondary/50">
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.name || '-'}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
