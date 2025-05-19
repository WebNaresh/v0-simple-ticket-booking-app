"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getUserBookings } from "../actions/booking-actions"
import type { Booking } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import BookingList from "@/components/booking-list"

export default function BookingsPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  const [email, setEmail] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(!!success)

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await getUserBookings(email)

      if (result.success) {
        setBookings(result.data)
      } else {
        setError(result.error || "Failed to fetch bookings")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {showSuccess && (
        <Alert className="bg-green-50">
          <AlertDescription>
            Booking completed successfully! Enter your email below to view your bookings.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Find Your Bookings</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Find Bookings"}
          </Button>
        </form>
      </div>

      {bookings.length > 0 ? (
        <BookingList
          bookings={bookings}
          onUpdate={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        />
      ) : (
        email &&
        !isLoading && (
          <div className="rounded-lg border p-8 text-center">
            <h2 className="text-xl font-semibold">No bookings found</h2>
            <p className="mt-2 text-muted-foreground">
              We couldn't find any bookings associated with this email address.
            </p>
          </div>
        )
      )}
    </div>
  )
}
