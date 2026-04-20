"use client"
import { ShieldCheckIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Alert, AlertAction, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'

export const HomeAdminPageAccessBtn = () => {
    const router = useRouter()
    const handleAdminNavigationClick = () => {
        router.push("/admin")
    }

    return (
        <Alert className='p-5'>
            <ShieldCheckIcon />
            <AlertTitle>Access Admin Dashboard.</AlertTitle>
            <AlertAction>
                <Button onClick={handleAdminNavigationClick}>Click</Button>
            </AlertAction>
        </Alert>
    )
}
