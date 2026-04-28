"use client"
import { useState } from "react"
import { ImageOff } from 'lucide-react'
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"


interface campusResourcesType {
  id: string;
  name: string;
  type?: string | null;
  capacity: number | null;
  location: string | null;
  status?: string | null;
  imageUrl: string | null;
}



export const Ai_CampusResource_card = ({ id, name, type, capacity, location, status, imageUrl }: campusResourcesType) => {
  const router = useRouter();
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(Boolean(imageUrl))

  const imgSrc = imageUrl ? `/api/upload/view?fileName=${encodeURIComponent(imageUrl)}` : null

  return (
    <Card className="group/card relative h-full w-full max-w-xs overflow-hidden border-0 p-0!  cursor-pointer" onClick={() => window.open("/resources/" + id, "_blank", "noopener,noreferrer")}>
      {/* Image area */}
      <div className="relative  w-full">
        {imgSrc && !hasError ? (
          <>
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center ">
                <Spinner className="size-6 " />
              </div>
            )}
            <img
              src={imgSrc}
              alt={name}
              className="h-50 w-full object-cover brightness-80 transition-transform duration-500 group-hover/card:scale-110"
              loading="lazy"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false)
                setHasError(true)
              }}
            />
          </>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center gap-2 px-2 text-xs bg-muted/30">
            <ImageOff className="size-4" />
            <span>No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-2">
        <h3 className="line-clamp-1 font-bold ">{name}</h3>
        {capacity != null && (
          <p className="text-sm  line-clamp-1">
            Capacity: {capacity}
          </p>
        )}
        {location != null && (
          <p className=" text-sm  line-clamp-1">location: {location}</p>
        )}
        {(type || status) && (
          <div className="flex flex-row gap-2 mt-2">
            {type ? <Badge>{type}</Badge> : null}
            {status ? <Badge>{status}</Badge> : null}
          </div>
        )}
      </div>
    </Card>
  )
}

