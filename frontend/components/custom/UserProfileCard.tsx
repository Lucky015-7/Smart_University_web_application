import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { BadgeCheck, CheckCircle2Icon } from "lucide-react"
import Image from "next/image"


const profilePicture = "https://images.pexels.com/photos/1827837/pexels-photo-1827837.jpeg"
const userName = "Pasan Perera"
const userEmail = "p.k.m.p.perera@gmail.com"
const userAccessLevel = "ADMIN"

export const UserProfileCard = () => {
    return (
        <main className='p-5 shadow-md rounded-lg h-full bg-card  '>
            <div className='max-w-md mx-auto'>
                <div className='relative'>
                    <AspectRatio ratio={16 / 5} className="rounded-lg bg-muted overflow-hidden">
                        <Image
                            src="https://images.pexels.com/photos/1827837/pexels-photo-1827837.jpeg"
                            alt="Banner"
                            fill
                            className="object-cover brightness-80"
                        />
                    </AspectRatio>
                    <div className='absolute -bottom-12 left-1/2 -translate-x-1/2 w-1/3'>
                        <AspectRatio ratio={1 / 1}>
                            <Image
                                src={profilePicture}
                                alt="Profile"
                                fill
                                className="rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </AspectRatio>
                    </div>
                </div>
                <div className="mt-16 mb-10 text-center">
                    <h2 className="text-xl font-bold">{userName}</h2>
                    <p className="text-muted-foreground text-sm">{userEmail}</p>
                    <Badge variant="secondary">
                        <BadgeCheck data-icon="inline-start" />
                        {userAccessLevel}
                    </Badge>
                </div>
            </div>
            {/* <Separator /> */}
            <div>
                <Card className='p-4 my-2'>
                    <CardContent>
                        <h3 className="text-muted-foreground text-sm font-medium my-2">Total Tickets</h3>
                        <div className="flex items-center gap-2.5">
                            <span className="text-foreground text-lg font-medium tracking-tight tabular-nums">1</span>
                            <Badge variant={"secondary"}>
                                <CheckCircle2Icon data-icon="inline-start" />
                                Completed
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="text-foreground text-lg font-medium tracking-tight tabular-nums">5</span>
                            <Badge variant={"outline"}>
                                <Spinner data-icon="inline-start" />
                                Pending
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className='p-4 my-2'>
                    <CardContent>
                        <h3 className="text-muted-foreground text-sm font-medium my-2">Bookings</h3>
                        <div className="flex items-center gap-2.5">
                            <span className="text-foreground text-lg font-medium tracking-tight tabular-nums">2</span>
                            <Badge variant={"secondary"}>
                                <CheckCircle2Icon data-icon="inline-start" />
                                Approved
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="text-foreground text-lg font-medium tracking-tight tabular-nums">1</span>
                            <Badge variant={"outline"}>
                                <Spinner data-icon="inline-start" />
                                Pending
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </main>
    )
}
