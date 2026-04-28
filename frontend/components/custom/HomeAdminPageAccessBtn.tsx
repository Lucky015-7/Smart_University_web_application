"use client"
import { ShieldCheckIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Alert, AlertAction, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/lib/roles'

export const HomeAdminPageAccessBtn = () => {
    const router = useRouter()
    const { loading, hasAnyRole } = useAuth()

    const handleAdminNavigationClick = () => {
        router.push("/admin")
    }

    // Don't render while auth is loading
    if (loading) return null

    // Only show to ADMIN or TECHNICIAN
    if (!hasAnyRole([UserRole.ADMIN, UserRole.TECHNICIAN])) return null

    return (
        <Alert className='p-5'>
            <ShieldCheckIcon />
            <AlertTitle>Access Admin Dashboard.</AlertTitle>
            <AlertAction>
                <Button onClick={handleAdminNavigationClick}>Open</Button>
            </AlertAction>
        </Alert>
    )
}
