"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AlertCircle, Clock, MessageCircle, User, Calendar } from "lucide-react"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { useRouter } from "next/navigation"
import { useUserName } from "@/lib/useUserName"
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/lib/roles'
import { Loader2 } from 'lucide-react'

interface TicketData {
  id: string
  resource: {
    id: string
    name: string
  } | null
  location: string
  category: string
  priority: string
  status: string
  description: string
  contactPhone: string
  createdBy: string
  assignedTo: string | null
  resolutionNotes: string | null
  createdAt: string
  updatedAt: string
  attachments?: string[] | null
  comments?: any[]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900" },
  RESOLVED: { label: "Resolved", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900" },
  CLOSED: { label: "Closed", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-900" },
  REJECTED: { label: "Rejected", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900" },
}

const priorityConfig: Record<string, { label: string; className: string; icon: string }> = {
  LOW: { label: "Low", className: "bg-muted text-foreground", icon: "📍" },
  MEDIUM: { label: "Medium", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400", icon: "⚠️" },
  HIGH: { label: "High", className: "bg-orange-500/10 text-orange-700 dark:text-orange-400", icon: "🔥" },
  CRITICAL: { label: "Critical", className: "bg-red-500/10 text-red-700 dark:text-red-400", icon: "🚨" },
}

export const AdminTicketRow = ({
  ticket,
  onSelect,
}: {
  ticket: TicketData
  onSelect: (ticket: TicketData) => void
}) => {
  const router = useRouter()
  const statusConfig_current = statusConfig[ticket.status] || statusConfig.OPEN
  const priorityConfig_current = priorityConfig[ticket.priority] || priorityConfig.LOW

  const handleNavigateToDetail = () => {
    router.push(`/admin/tickets/${encodeURIComponent(ticket.id)}`)
  }

  function AssignedNameDisplay({ assignedTo }: { assignedTo: string | null }) {
    const { name, email, loading } = useUserName(assignedTo)
    const { hasRole, loading: authLoading } = useAuth()

    if (!assignedTo) return <span>Unassigned</span>

    const isAdmin = !authLoading && hasRole(UserRole.ADMIN)

    if (loading) return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    )

    return (
      <div className="flex flex-col">
        <span className="text-sm">{name ?? assignedTo}</span>
        {email && <span className="text-xs text-muted-foreground">{email}</span>}
        {/* Raw user IDs are hidden for all users */}
      </div>
    )
  }

  return (
    <Card
      onClick={handleNavigateToDetail}
      className="p-4 cursor-pointer hover:shadow-md transition-all hover:border-primary/50 border border-border/50"
    >
      <div className="space-y-3">
        {/* Header: ID and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-muted-foreground">{ticket.id}</p>
            <h3 className="text-base font-bold truncate">{ticket.resource?.name || "No Resource"}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {ticket.description}
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Badge variant="outline" className={cn("border", statusConfig_current.className)}>
              {statusConfig_current.label}
            </Badge>
            <Badge variant="outline" className={cn("border", priorityConfig_current.className)}>
              {priorityConfig_current.icon} {priorityConfig_current.label}
            </Badge>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{ticket.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatTimeAgo(ticket.createdAt)}</span>
          </div>
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <span>📎 {ticket.attachments.length}</span>
            </div>
          )}
          {ticket.comments && ticket.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{ticket.comments.length}</span>
            </div>
          )}
        </div>

        {/* Footer: Assignee and Contact */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <AssignedNameDisplay assignedTo={ticket.assignedTo} />
            </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleNavigateToDetail()
            }}
          >
            Manage →
          </Button>
        </div>
      </div>
    </Card>
  )
}
