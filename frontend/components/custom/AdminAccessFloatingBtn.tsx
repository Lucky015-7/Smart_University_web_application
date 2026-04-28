"use client"

import { ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/lib/roles'
import { Button } from '@/components/ui/button'

export const AdminAccessFloatingBtn = () => {
  const router = useRouter()
  const { loading, hasAnyRole } = useAuth()

  if (loading) return null

  if (!hasAnyRole([UserRole.ADMIN, UserRole.TECHNICIAN])) return null

  return (
    <div className="fixed bottom-20 right-5 z-50">
      <Button
        variant="secondary"
        className="rounded-full shadow-lg flex items-center gap-2"
        onClick={() => router.push('/admin')}
      >
        <ShieldCheck /> Admin
      </Button>
    </div>
  )
}
