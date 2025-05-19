"use client"

import { useState } from "react"
import type { Booking } from "@/lib/models"
import { formatDate, formatCurrency } from "@/lib/utils"
import { cancelBooking } from "@/app/actions/booking-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
} from "@/components/ui/alert-dialog"

interface BookingListProps {
  bookings: Booking[]
  onUpdate: () => void
}

export default function BookingList({ bookings, onUpdate }: BookingListProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleCancelBooking = async (id: string) => {
    setIsProcessing(id)

    try {
      await cancelBooking(id)
      onUpdate()
    } catch (error) {
      console.error("Failed to cancel booking:", error)
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Bookings</h2>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking._id?.toString()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{booking.ticketName}</CardTitle>
                  <CardDescription>Booking ID: {booking._id?.toString().substring(0, 8)}...</CardDescription>
                </div>
                <Badge variant={booking.status === "confirmed" ? "default" : "destructive"}>
                  {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Booking Details</div>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.quantity} {booking.quantity === 1 ? "ticket" : "tickets"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Booked on {formatDate(booking.bookingDate)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Customer Information</div>
                  <div>{booking.customerName}</div>
                  <div>{booking.customerEmail}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-lg font-bold">Total: {formatCurrency(booking.totalPrice)}</div>

              {booking.status === "confirmed" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isProcessing === booking._id?.toString()}>
                      {isProcessing === booking._id?.toString() ? "Processing..." : "Cancel Booking"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will cancel your booking and refund your tickets to the
                        available pool.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleCancelBooking(booking._id!.toString())}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
