"use client"
import React, { useEffect, useState } from 'react'
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { toast } from 'sonner'
import { Field } from '../ui/field'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { LoadingData } from './LoadingData'
import { EmptyData } from './EmptyData'
import MyTicketsCard from './MyTicketsCard'


 interface ResourceSummary {
    id: string;
    name: string;
}
interface Link {
    href: string;
}
interface TicketLinks {
    comments: Link;
    self: Link;
}

interface TicketResponseData {
    id: string;
    resource: ResourceSummary;
    location: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    _links: TicketLinks;
}

interface ApiResponseProps {
    data: {
        items: TicketResponseData[];
    };
    status: string;
    error: string | null;
}

export const MyTickets = () => {
  const [tickets, setTickets] = useState<TicketResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tickets/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result: ApiResponseProps = await response.json();
        if (result.status === "success") {
          setTickets(result.data.items);
        }

      } catch (error) {
        toast.warning("Something went wrong!")
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  if (loading) return <div><LoadingData /></div>;
  if (!loading && tickets.length === 0) return <div><EmptyData /></div>;


  return (
    <main>
      <MyTicketsCard />
    </main>
  )
}
