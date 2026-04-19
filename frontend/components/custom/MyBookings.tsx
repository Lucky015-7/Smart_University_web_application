"use client"

import React, { useEffect, useState } from "react"
import { MoreHorizontalIcon, SearchIcon, CalendarClockIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LoadingData } from "./LoadingData"
import { EmptyData } from "./EmptyData"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Link { href: string }
export interface BookingLinks {
  resource: Link
  self: Link
  resource_availability: Link
}
export interface ResourceSummary { id: string; name: string }
export interface BookingResponseData {
  id: string
  resource: ResourceSummary
  startTime: string
  endTime: string
  status: string
  _links: BookingLinks
}
interface ApiResponseProps {
  data: { items: BookingResponseData[] }
  status: string
  error: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateTime = (iso: string) => {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  }
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-[#fff8f2] border-[#b8afa6] text-[#6e6258]",
  APPROVED:  "bg-[#f0f5ec] border-[#a8b89e] text-[#4a6040]",
  REJECTED:  "bg-[#fdf0ee] border-[#d4a89e] text-[#8a3828]",
  CANCELLED: "bg-[#f4f2ef] border-[#c0b8b0] text-[#8a8278]",
}

const StatusBadge = ({ status }: { status: string }) => (
  <span className={[
    "inline-flex items-center rounded-full border px-[10px] py-[3px] text-[11px] font-medium tracking-wide",
    STATUS_STYLES[status] ?? "bg-[#f4f2ef] border-[#c0b8b0] text-[#8a8278]",
  ].join(" ")}>
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
)

// ─── Main Component ───────────────────────────────────────────────────────────

export const MyBookings = () => {
  const [bookings, setBookings] = useState<BookingResponseData[]>([])
  const [filtered, setFiltered] = useState<BookingResponseData[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/bookings/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        const result: ApiResponseProps = await response.json()
        if (result.status === "success") {
          setBookings(result.data.items)
          setFiltered(result.data.items)
        }
      } catch (error) {
        toast.warning("Something went wrong!")
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter whenever search or statusFilter changes
  useEffect(() => {
    let result = bookings
    if (statusFilter !== "ALL") result = result.filter((b) => b.status === statusFilter)
    if (search.trim()) result = result.filter((b) =>
      b.resource.name.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, statusFilter, bookings])

  if (loading) return <LoadingData />
  if (!loading && bookings.length === 0) return <EmptyData />

  const statuses = ["ALL", ...Array.from(new Set(bookings.map((b) => b.status)))]

  return (
    <div className="min-h-screen bg-[#e8e4df] px-6 py-8">

      {/* ── Page header ── */}
      <div className="mb-8">
        <p className="mb-[6px] flex items-center gap-[6px] text-[10.5px] font-medium uppercase tracking-[0.2em] text-[#9c9288]">
          <span className="inline-block h-[5px] w-[5px] rounded-full bg-[#a09080]" />
          Reservations
        </p>
        <h1 className="font-serif text-[28px] font-semibold tracking-tight text-[#2c2820]">
          My bookings
        </h1>
        <p className="mt-1 text-[13px] text-[#9c9288]">
          View and manage all your space reservations.
        </p>
      </div>

      {/* ── Toolbar ── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-[11px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#a09080]" />
          <input
            type="search"
            placeholder="Search by resource…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[10px] border-[1.5px] border-[#b8afa6] bg-[#fff8f2] py-[9px] pl-[34px] pr-[13px] text-[13.5px] text-[#2c2820] placeholder:text-[#b8b0a8] shadow-[0_1px_3px_rgba(100,88,76,0.09)] outline-none transition focus:border-[#8a7e74] focus:ring-2 focus:ring-[#a09080]/10"
          />
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-[6px]">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={[
                "rounded-full border-[1.5px] px-[12px] py-[4px] text-[11.5px] font-medium transition shadow-[0_1px_3px_rgba(100,88,76,0.08)]",
                statusFilter === s
                  ? "border-[#3a3028] bg-[#3a3028] text-[#e8e0d5] shadow-[0_2px_8px_rgba(40,32,24,0.16)]"
                  : "border-[#b8afa6] bg-[#fff8f2] text-[#5a5048] hover:border-[#8a7e74] hover:bg-[#f0e8e0] hover:text-[#2c2820]",
              ].join(" ")}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="relative overflow-hidden rounded-[20px] border border-[#d8d2cc] bg-[#f2eeea] shadow-[0_8px_40px_rgba(100,90,80,0.10)]">

        {/* Top highlight line */}
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarClockIcon className="mb-3 h-8 w-8 text-[#c0b8b0]" />
            <p className="text-[14px] font-medium text-[#8a8278]">No bookings match your filter</p>
            <p className="mt-1 text-[12.5px] text-[#b8b0a8]">Try adjusting your search or status filter.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e0d8d0]">
                {["Resource", "Start", "End", "Status", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-5 py-[14px] text-[10.5px] font-medium uppercase tracking-[0.12em] text-[#9c9288]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking, idx) => {
                const start = formatDateTime(booking.startTime)
                const end = formatDateTime(booking.endTime)
                const isLast = idx === filtered.length - 1
                return (
                  <tr
                    key={booking.id}
                    className={[
                      "group transition hover:bg-[#ede8e2]",
                      !isLast ? "border-b border-[#e8e2dc]" : "",
                    ].join(" ")}
                  >
                    {/* Resource */}
                    <td className="px-5 py-[14px]">
                      <button
                        onClick={() => router.push(`/resources/${booking.resource.id}`)}
                        className="text-[13.5px] font-medium text-[#2c2820] underline decoration-[#c0b8b0] underline-offset-2 transition hover:decoration-[#8a7e74] hover:translate-x-0.5"
                      >
                        {booking.resource.name}
                      </button>
                    </td>

                    {/* Start */}
                    <td className="px-5 py-[14px]">
                      <p className="text-[13px] text-[#2c2820]">{start.date}</p>
                      <p className="text-[11.5px] text-[#9c9288]">{start.time}</p>
                    </td>

                    {/* End */}
                    <td className="px-5 py-[14px]">
                      <p className="text-[13px] text-[#2c2820]">{end.date}</p>
                      <p className="text-[11.5px] text-[#9c9288]">{end.time}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-[14px]">
                      <StatusBadge status={booking.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-[14px] text-right">
                      {booking.status === "PENDING" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border-[1.5px] border-[#b8afa6] bg-[#fff8f2] text-[#6e6258] shadow-[0_1px_3px_rgba(100,88,76,0.09)] transition hover:border-[#8a7e74] hover:bg-[#f0e8e0] hover:text-[#2c2820]">
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-[12px] border border-[#d8d2cc] bg-[#f2eeea] shadow-[0_8px_24px_rgba(100,90,80,0.14)] p-1"
                          >
                            <DropdownMenuItem className="rounded-[8px] text-[13px] text-[#8a3828] focus:bg-[#fdf0ee] focus:text-[#8a3828] cursor-pointer px-3 py-[7px]">
                              Cancel booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Footer count ── */}
      <p className="mt-4 text-right text-[11.5px] text-[#b8b0a8]">
        {filtered.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
      </p>

    </div>
  )
}