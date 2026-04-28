"use client"

import { useState } from 'react'
import { Alert, AlertTitle } from '../ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import MarkdownPreview from './MarkdownPreview'
import { Edit2, Trash2, X, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
})

interface commentCardTypes {
    userName?: string
    comment?: string
    commentId?: string
    authorId?: string
    currentUserId?: string
    ticketId?: string
    onCommentUpdated?: () => void
    data?: {
        id?: string
        userName?: string
        authorName?: string
        authorId?: string
        comment?: string
        text?: string
        ticketId?: string
    }
}

export const CommentCard = ({ 
    userName, 
    comment, 
    commentId, 
    authorId,
    currentUserId,
    ticketId,
    onCommentUpdated,
    data 
}: commentCardTypes) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState('')
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const { theme, resolvedTheme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)

    const colorMode =
        isMounted && (resolvedTheme ?? theme) === "dark"
            ? "dark"
            : isMounted
                ? "light"
                : undefined

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const resolvedUserName = userName || data?.userName || data?.authorName || data?.authorId || 'Anonymous'
    const resolvedComment = comment || data?.comment || data?.text || ''
    const resolvedCommentId = commentId || data?.id
    const resolvedAuthorId = authorId || data?.authorId
    const resolvedTicketId = ticketId || data?.ticketId
    
    // Check if current user is the comment author
    const isCurrentUserAuthor = currentUserId && resolvedAuthorId && currentUserId === resolvedAuthorId

    const handleEditClick = () => {
        setEditText(resolvedComment)
        setIsEditing(true)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditText('')
    }

    const handleUpdateComment = async () => {
        if (!editText.trim() || !resolvedCommentId || !resolvedTicketId) return

        setIsUpdating(true)
        try {
            const response = await fetch(
                `/api/tickets/${encodeURIComponent(resolvedTicketId)}/comments/${encodeURIComponent(resolvedCommentId)}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: editText }),
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData?.error?.message || 'Failed to update comment')
            }

            toast.success('Comment updated successfully!')
            setIsEditing(false)
            onCommentUpdated?.()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update comment')
            console.error('Error updating comment:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteComment = async () => {
        if (!resolvedCommentId || !resolvedTicketId) return

        setIsDeleting(true)
        try {
            const response = await fetch(
                `/api/tickets/${encodeURIComponent(resolvedTicketId)}/comments/${encodeURIComponent(resolvedCommentId)}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData?.error?.message || 'Failed to delete comment')
            }

            toast.success('Comment deleted successfully!')
            onCommentUpdated?.()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete comment')
            console.error('Error deleting comment:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    if (isEditing) {
        return (
            <Card className='mb-5 p-4 border-primary/20 bg-card/50'>
                <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                        <Avatar className="border-border/10 size-8 border">
                            <AvatarImage
                                src="https://images.pexels.com/photos/1827837/pexels-photo-1827837.jpeg"
                                alt={resolvedUserName}
                            />
                            <AvatarFallback>{resolvedUserName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{resolvedUserName} (editing)</span>
                    </div>
                    
                    {isMounted ? (
                        <div data-color-mode={colorMode} className='rounded-lg border border-border p-3'>
                            <MDEditor
                                value={editText}
                                onChange={(val) => setEditText(val || '')}
                                height={200}
                                style={{ backgroundColor: "transparent" }}
                                preview="edit"
                                hideToolbar={false}
                                visibleDragbar={false}
                                previewOptions={{
                                    style: { backgroundColor: "transparent" },
                                }}
                            />
                        </div>
                    ) : null}

                    <div className='flex gap-2 justify-end'>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                            className='gap-2'
                        >
                            <X className='h-4 w-4' />
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleUpdateComment}
                            disabled={!editText.trim() || isUpdating}
                            className='gap-2 bg-primary text-primary-foreground hover:bg-primary/90'
                        >
                            {isUpdating ? <Loader2 className='h-4 w-4 animate-spin' /> : <Check className='h-4 w-4' />}
                            Save
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className='mb-5 p-2 pb-5'>
            <CardContent className="overflow-hidden p-0!">
                <Alert
                    variant="default"
                    className="grid-cols-[32px_1fr_auto] gap-x-3 border-0 shadow-none"
                >
                    <Avatar className="border-border/10 size-8 border">
                        <AvatarImage
                            src="https://images.pexels.com/photos/1827837/pexels-photo-1827837.jpeg"
                            alt={resolvedUserName}
                        />
                        <AvatarFallback>{resolvedUserName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <AlertTitle className="flex items-center gap-2">
                        <span className="truncate">{resolvedUserName}</span>
                    </AlertTitle>
                    
                    {isCurrentUserAuthor && (
                        <div className='flex gap-1'>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleEditClick}
                                className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-primary/10'
                                title="Edit comment"
                            >
                                <Edit2 className='h-4 w-4' />
                            </Button>
                            
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className='h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                                        title="Delete comment"
                                    >
                                        <Trash2 className='h-4 w-4' />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this comment? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteComment}
                                            disabled={isDeleting}
                                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                    Deleting...
                                                </>
                                            ) : (
                                                'Delete'
                                            )}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </Alert>
                <CardContent>
                    <MarkdownPreview content={resolvedComment} />
                </CardContent>
            </CardContent>
        </Card>
    )
}
