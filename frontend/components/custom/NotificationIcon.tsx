import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useNotifications } from '@/hooks/useNotifications'
import { Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { NotificationBox } from './NotificationBox'




export const NotificationIcon = () => {
    const router = useRouter()
    const handleViewAllClick = () => {
        router.push("/notifications")
    }
    const { notifications, loading } = useNotifications();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onSelect={(e) => e.preventDefault()}>
                <Button variant="outline" size="icon">
                    <Bell />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-100 m-5 shadow-2xl max-h-[80vh] overflow-y-auto">
                <DropdownMenuGroup>
                    <div className='flex justify-between'>
                        <DropdownMenuLabel className='font-bold text-md'>Notifications</DropdownMenuLabel>
                        <Button variant={"link"} onClick={handleViewAllClick}>View All</Button>
                    </div>
                    <DropdownMenuGroup >
                        {!loading ? (

                            notifications.map((notification) => (
                                <DropdownMenuItem>
                                    <NotificationBox
                                        key={notification.id}
                                        id={notification.id}
                                        title={notification.title}
                                        message={notification.message}
                                        createdAt={notification.createdAt}
                                        read={notification.read}
                                    />
                                </DropdownMenuItem>
                            ))

                        ) : (
                            <div>
                                <Card className="m-5 mb-2">
                                    <CardContent>
                                        <Skeleton className="h-4 w-1/2 my-1" />
                                        <Skeleton className="h-4 w-2/3 my-1" />
                                        <Skeleton className="h-4 w-1/4 my-1" />
                                    </CardContent>
                                </Card>
                                <Card className="m-5 mb-2">
                                    <CardContent>
                                        <Skeleton className="h-4 w-1/2 my-1" />
                                        <Skeleton className="h-4 w-2/3 my-1" />
                                        <Skeleton className="h-4 w-1/4 my-1" />
                                    </CardContent>
                                </Card>
                                <Card className="m-5 mb-2">
                                    <CardContent>
                                        <Skeleton className="h-4 w-1/2 my-1" />
                                        <Skeleton className="h-4 w-2/3 my-1" />
                                        <Skeleton className="h-4 w-1/4 my-1" />
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
