"use client";
import React, { useMemo } from 'react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/lib/auth-context'
import { getRoleDisplayName } from '@/lib/roles'

function initialsFromName(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const UserCard_navbar = () => {
    const { 
        name, 
        email, 
        primaryRole, 
        loading, 
        error 
    } = useAuth();

    let avatar_image = "https://images.pexels.com/photos/2103864/pexels-photo-2103864.jpeg"
    let avatar_image_alt = name ?? "Unknown User";
    const userName = name ?? "Unknown User";
    const userEmail = email ?? "unknown@university.edu";
    const userAccessLevel = primaryRole ? getRoleDisplayName(primaryRole) : "User";
    const avatarFallback = useMemo(() => initialsFromName(userName), [userName]);

    if (loading) {
        return <div className="text-sm text-muted-foreground">Loading user...</div>;
    }

    if (error) {
        return <div className="text-sm text-red-500">Profile error: {error}</div>;
    }
    
    return (
        <div className="flex items-center justify-center">
            <HoverCard openDelay={100} closeDelay={200}>
                <HoverCardTrigger>
                    <div className="flex cursor-pointer items-center gap-2">
                        <Avatar className="size-8">
                            <AvatarImage
                                src={avatar_image}
                                alt={avatar_image_alt}
                            />
                            <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium hover:underline">
                                {userName}
                            </p>
                            <p className="text-muted-foreground text-xs">{userEmail}</p>
                        </div>
                    </div>
                </HoverCardTrigger>

                <HoverCardContent className="mx-3">
                    <div className="flex space-x-2">
                        <Avatar className="size-10 shrink-0">
                            <AvatarImage
                                src={avatar_image}
                                alt={avatar_image_alt}
                            />
                            <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div>
                                <p className="text-sm font-medium hover:underline">
                                    {userName}
                                </p>
                                <p className="text-muted-foreground text-xs">{userEmail}</p>
                            </div>
                            <p className="text-foreground hover:text-primary">{userAccessLevel}</p>
                            {/* <div className="flex items-center gap-1">
                                <CalendarIcon className="size-3.5 opacity-60" />
                                <span className="text-muted-foreground text-xs leading-none">
                                    Joined {joinedDate}
                                </span>
                            </div> */}
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}
