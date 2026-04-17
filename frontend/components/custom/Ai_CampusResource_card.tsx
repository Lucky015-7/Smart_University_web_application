"use client"
import Image from "next/image"

import { Card } from "@/components/ui/card"


export const Ai_CampusResource_card = () => {
  return (
    <Card className="group/card relative h-96 w-full max-w-xs overflow-hidden border-0 p-0!">
      <Image
        src="/classroom1.jpg"
        alt="Background"
        fill
        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
      />

      {/* Background fade effects */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-500 group-hover/card:from-black/70" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white">Advanced Robotics</h3>
        <p className="mt-2 text-sm text-white/90">Type: LAB</p>
        <p className="mt-2 text-sm text-white/90">Capacity: 15</p>
        <p className="mt-2 text-sm text-white/90">location: Building 4, Basement</p>
        <p className="mt-2 text-sm text-white/90">status: ACTIVE</p>
      </div>
    </Card>
  )
}

