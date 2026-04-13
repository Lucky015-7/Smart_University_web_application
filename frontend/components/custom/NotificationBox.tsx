"use client"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { Bell } from 'lucide-react'
import { useRouter } from "next/navigation"
import { toast } from "sonner"


// let title = "Basic Item"
// let message = "A simple item with title and message."
// let createdAt = "2 days ago"
// let isRead = 1

interface NotificationProps {
  id: string
  title: string;
  message?: string;
  createdAt: string
  read: boolean
}

interface ApiResponseProps {
  status: string;
  error: string | null;
}

export const NotificationBox = ({ id, title, message, createdAt, read }: NotificationProps) => {
  const router = useRouter();
  const handleClick = async () => {
    if (!read) {
      await makeReadNotification(id);
    }
    router.push(`/notifications/${id}`)
    // router.refresh()
  }
  return (
    <div onClick={handleClick}
      className='cursor-pointer my-2 active:translate-1 transition duration-150 w-full'>
      <Item variant={`${read ? 'default' : 'muted'}`} className={`hover:border-primary bg-transparent transition duration-300 ease-in-out shadow-lg ${read && `opacity-50 blur-[0.5px] hover:opacity-100 hover:blur-none`}`}>
        <ItemMedia variant="icon">
          <Bell />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className='font-bold'>{title}</ItemTitle>
          <ItemDescription className='wrap-anywhere line-clamp-1'>{message}</ItemDescription>
          <ItemDescription className=" opacity-50">{formatTimeAgo(createdAt)}</ItemDescription>
        </ItemContent>
        {/* <ItemActions>
          <Button>View</Button>
        </ItemActions> */}
      </Item>
    </div>
  )
}


const makeReadNotification = async (id: string) => {
  try {
    const response = await fetch(`/api/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    })

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
  } catch (error) {
    toast.warning("Something went wrong!")
    console.error("Failed to fetch resource:", error);
  }
} 