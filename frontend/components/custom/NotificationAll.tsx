'use client'
import { NotificationBox } from '@/components/custom/NotificationBox'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useNotifications } from '@/hooks/useNotifications'






export const Notification = () => {

  const { notifications, loading } = useNotifications();



  if (loading) {
    return (
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
    )
  }
  return (
    <div>
      {notifications.map((notification) => (
        <NotificationBox
          key={notification.id}
          id={notification.id}
          title={notification.title}
          message={notification.message}
          createdAt={notification.createdAt}
          read={notification.read}
        />
      ))}
    </div>
  )
}
