"use client"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle } from "lucide-react"
import { formatTime } from "@/lib/formatTime"

interface AvailabilityWindow {
  day: string
  startTime: string
  endTime: string
}

interface AvailabilityDisplayProps {
  resourceId: string
}

interface BookingListItem {
  id: string
  startTime: string
  endTime: string
  status: string
}

interface BookingListResponse {
  data?: {
    items?: BookingListItem[]
  }
  status?: string
}

interface AvailabilityResponse {
  data?: {
    items?: AvailabilityWindow[]
  }
  status?: string
}

interface TimeSlot {
  start: Date
  end: Date
}

interface DaySchedule {
  date: Date
  dayLabel: string
  slots: TimeSlot[]
}

const BOOKED_STATUSES = new Set(["PENDING", "APPROVED"])

const isSameLocalDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export const AvailabilityDisplay = ({ resourceId }: AvailabilityDisplayProps) => {
  const [availabilityWindows, setAvailabilityWindows] = useState<AvailabilityWindow[]>([])
  const [bookings, setBookings] = useState<BookingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true)
        setError(null)

        const [availabilityRes, bookingsRes] = await Promise.all([
          fetch(
          `/api/resources/${encodeURIComponent(resourceId)}/availability`,
          { method: "GET" }
          ),
          fetch(
            `/api/bookings?resourceId=${encodeURIComponent(resourceId)}&page=1&limit=500`,
            { method: "GET" }
          ),
        ])

        if (!availabilityRes.ok) {
          if (availabilityRes.status === 404) {
            setError("Resource not found")
          } else {
            throw new Error(`Server responded with ${availabilityRes.status}`)
          }
          return
        }

        const availabilityResult: AvailabilityResponse = await availabilityRes.json()
        const bookingsResult: BookingListResponse = bookingsRes.ok
          ? await bookingsRes.json()
          : { data: { items: [] }, status: "error" }

        if (availabilityResult.status === "success") {
          setAvailabilityWindows(availabilityResult.data?.items || [])
          setBookings(bookingsResult.data?.items || [])
        } else {
          setError("Failed to load availability")
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch availability"
        setError(message)
        console.error("Failed to fetch availability:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [resourceId])

  const daySchedules: DaySchedule[] = (() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const nextSevenDays = Array.from({ length: 7 }, (_, offset) => {
      const date = new Date(today)
      date.setDate(today.getDate() + offset)
      return date
    })

    const relevantBookings = bookings
      .filter((booking) => BOOKED_STATUSES.has((booking.status || "").toUpperCase()))
      .map((booking) => ({
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
      }))

    return nextSevenDays.map((date) => {
      const slots: TimeSlot[] = relevantBookings
        .filter((booking) => isSameLocalDate(booking.start, date))
        .map((booking) => ({
          start: booking.start,
          end: booking.end,
        }))

      slots.sort((a, b) => a.start.getTime() - b.start.getTime())

      return {
        date,
        dayLabel: date.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
        slots,
      }
    })
  })()

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <Clock className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Availability
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                View when this resource is available for booking
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {availabilityWindows.length} slots
          </Badge>
        </div>
      </CardHeader>

      <Separator className="mb-0" />

      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <Clock className="size-5 text-muted-foreground" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-destructive">
            <AlertCircle className="size-6" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : availabilityWindows && availabilityWindows.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Booked Times (Next 7 Days)
                </p>
              </div>

              {daySchedules.map((day) => {
                const bookedCount = day.slots.length

                return (
                  <div key={day.date.toISOString()} className="rounded-lg border border-border/50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold">{day.dayLabel}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {bookedCount} booked
                      </Badge>
                    </div>

                    {day.slots.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot) => (
                          <Badge
                            key={`${slot.start.toISOString()}-${slot.end.toISOString()}`}
                            className="px-2 py-1 text-[11px] bg-rose-100 text-rose-700 hover:bg-rose-100"
                          >
                            {`${formatTime(slot.start.toTimeString())} - ${formatTime(slot.end.toTimeString())}`} (Booked)
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No booked times for this day.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> You can only book this resource during these available hours.
                Check back later if your preferred time slot is not available.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <Clock className="size-8 opacity-30" />
            <p className="text-sm font-medium">No availability configured</p>
            <p className="text-xs">Contact the administrator for more information</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
