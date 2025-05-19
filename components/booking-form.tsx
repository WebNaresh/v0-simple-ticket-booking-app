"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Ticket } from "@/lib/models"
import { createBooking } from "@/app/actions/booking-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ObjectId } from "mongodb"

interface BookingFormProps {
  ticket: Ticket
}

export default function BookingForm({ ticket }: BookingFormProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = ticket.price * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (quantity < 1) {
      setError("Quantity must be at least 1")
      setIsSubmitting(false)
      return
    }

    if (quantity > ticket.available) {
      setError(`Only ${ticket.available} tickets available`)
      setIsSubmitting(false)
      return
    }

    try {
      const result = await createBooking({
        ticketId: new ObjectId(ticket._id!.toString()),
        ticketName: ticket.name,
        customerName,
        customerEmail,
        quantity,
        totalPrice,
        bookingDate: new Date().toISOString(),
        status: "confirmed",
      })

      if (result.success) {
        router.push("/bookings?success=true")
      } else {
        setError(result.error || "Failed to create booking")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="customerName">Your Name</Label>
        <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerEmail">Email Address</Label>
        <Input
          id="customerEmail"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Number of Tickets</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={ticket.available}
          value={quantity}
          onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
          required
        />
        <p className="text-sm text-muted-foreground">{ticket.available} tickets available</p>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm font-medium">Total Price</div>
        <div className="text-xl font-bold">${totalPrice.toFixed(2)}</div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Complete Booking"}
      </Button>
    </form>
  )
}
