"use client";

import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
export default function AdminBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [reason, setReason] = useState("");

  // Fetch all bookings for Admin view
  const fetchAllBookings = async () => {
    const res = await fetch('/api/bookings?limit=50'); // Fetching more for Admin overview
    const data = await res.json();
    if (data.status === "success") {
      setBookings(data.data.items);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Update Status Logic (Module B Requirement)
  const handleStatusUpdate = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    if (!reason && newStatus === 'REJECTED') {
      toast.error("A reason is required for rejection");
      return;
    }

    const response = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, reason })
    });

    if (response.ok) {
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
      setReason("");
      fetchAllBookings(); // Refresh the list
    }
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin: Booking Management</h1>
      
      <div className="space-y-6">
        {bookings.map((booking: any) => (
          <div key={booking.id} className="p-6 border rounded-xl shadow-sm bg-white flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">{booking.id}</span>
                <Badge variant={booking.status === 'PENDING' ? 'outline' : 'default'}>
                  {booking.status}
                </Badge>
              </div>
              <p className="font-bold text-lg">{booking.resourceInfo.name}</p>
              <p className="text-sm">User ID: <span className="font-semibold">{booking.userId}</span></p>
              <p className="text-sm text-gray-500">
                {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
              </p>
              <p className="text-sm italic text-gray-600">"{booking.purpose}"</p>
            </div>

            {booking.status === 'PENDING' && (
              <div className="flex flex-col gap-2 min-w-[250px]">
                <Input 
                  placeholder="Reason for decision..." 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="text-center text-gray-500 py-20">No booking requests found.</p>
        )}
      </div>
    </main>
  );
}