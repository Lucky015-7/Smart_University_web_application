"use client";

import React, { useState } from 'react';
import BookingForm from "@/components/bookings/BookingForm";
import BookingList from "@/components/bookings/BookingList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Main Bookings Page for Member 2 (Module B).
 * Orchestrates the booking request form and the user's booking history.
 */
export default function BookingsPage() {
  // In a real implementation, the resourceId would come from Module A's catalog selection.
  // Using a default ID for demonstration/testing as per Member 2 requirements.
  const [selectedResourceId, setSelectedResourceId] = useState("RES-101");

  return (
    <main className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facility & Asset Bookings</h1>
          <p className="text-muted-foreground mt-2">
            Request resources and manage your campus activity schedule.
          </p>
        </div>

        <Tabs defaultValue="new-booking" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="new-booking">New Request</TabsTrigger>
            <TabsTrigger value="my-bookings">My History</TabsTrigger>
          </TabsList>

          <TabsContent value="new-booking" className="mt-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <BookingForm resourceId={selectedResourceId} />
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Booking Guidelines</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4 text-muted-foreground">
                    <li>Conflicts are checked in real-time[cite: 63].</li>
                    <li>Admins must approve all pending requests[cite: 62].</li>
                    <li>Check your history tab for status updates[cite: 65].</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-bookings" className="mt-6">
            <BookingList />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}