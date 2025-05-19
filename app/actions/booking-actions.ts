"use server"

import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { Booking } from "@/lib/models"
import { updateTicketAvailability } from "./ticket-actions"

// Create a new booking
export async function createBooking(bookingData: Omit<Booking, "_id">) {
  try {
    const client = await clientPromise
    const db = client.db("ticketBooking")

    // Update ticket availability
    const availabilityResult = await updateTicketAvailability(bookingData.ticketId.toString(), bookingData.quantity)

    if (!availabilityResult.success) {
      return availabilityResult
    }

    const result = await db.collection("bookings").insertOne({
      ...bookingData,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
    })

    revalidatePath("/bookings")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to create booking:", error)
    return { success: false, error: "Failed to create booking" }
  }
}

// Get all bookings for a user
export async function getUserBookings(email: string) {
  try {
    const client = await clientPromise
    const db = client.db("ticketBooking")

    const bookings = await db.collection("bookings").find({ customerEmail: email }).sort({ bookingDate: -1 }).toArray()

    return { success: true, data: bookings }
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    return { success: false, error: "Failed to fetch bookings" }
  }
}

// Update a booking
export async function updateBooking(id: string, updates: Partial<Booking>) {
  try {
    const client = await clientPromise
    const db = client.db("ticketBooking")

    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) })

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    // If quantity is being updated, update ticket availability
    if (updates.quantity && updates.quantity !== booking.quantity) {
      const quantityDiff = updates.quantity - booking.quantity

      if (quantityDiff > 0) {
        // Increasing quantity, check if enough tickets are available
        const availabilityResult = await updateTicketAvailability(booking.ticketId.toString(), quantityDiff)

        if (!availabilityResult.success) {
          return availabilityResult
        }
      } else {
        // Decreasing quantity, add tickets back to available pool
        const client = await clientPromise
        const db = client.db("ticketBooking")

        await db
          .collection("tickets")
          .updateOne({ _id: booking.ticketId }, { $inc: { available: Math.abs(quantityDiff) } })
      }

      // Update total price if quantity changes
      if (updates.quantity) {
        updates.totalPrice = updates.quantity * (booking.totalPrice / booking.quantity)
      }
    }

    const result = await db.collection("bookings").updateOne({ _id: new ObjectId(id) }, { $set: updates })

    revalidatePath("/bookings")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to update booking:", error)
    return { success: false, error: "Failed to update booking" }
  }
}

// Cancel a booking
export async function cancelBooking(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("ticketBooking")

    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) })

    if (!booking) {
      return { success: false, error: "Booking not found" }
    }

    // Add tickets back to available pool
    await db.collection("tickets").updateOne({ _id: booking.ticketId }, { $inc: { available: booking.quantity } })

    const result = await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "cancelled" } })

    revalidatePath("/bookings")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to cancel booking:", error)
    return { success: false, error: "Failed to cancel booking" }
  }
}
