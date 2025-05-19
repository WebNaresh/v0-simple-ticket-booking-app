"use server"

import clientPromise from "@/lib/mongodb"
import type { Ticket } from "@/lib/models"
import { revalidatePath } from "next/cache"

export async function seedTickets() {
  try {
    const client = await clientPromise
    const db = client.db("ticketBooking")

    // Check if tickets collection already has data
    const count = await db.collection("tickets").countDocuments()

    if (count > 0) {
      return { success: true, message: "Database already seeded" }
    }

    const sampleTickets: Omit<Ticket, "_id">[] = [
      {
        name: "Concert: Rock Band",
        description: "Live performance by the famous Rock Band",
        price: 50,
        date: "2025-06-15",
        time: "19:00",
        available: 100,
      },
      {
        name: "Movie Premiere",
        description: "Exclusive premiere of the new blockbuster movie",
        price: 25,
        date: "2025-06-20",
        time: "20:00",
        available: 150,
      },
      {
        name: "Theater Play",
        description: "Award-winning theater performance",
        price: 35,
        date: "2025-06-25",
        time: "18:30",
        available: 80,
      },
      {
        name: "Sports Game",
        description: "Championship finals",
        price: 45,
        date: "2025-07-01",
        time: "15:00",
        available: 200,
      },
      {
        name: "Comedy Show",
        description: "Stand-up comedy night with top comedians",
        price: 30,
        date: "2025-07-05",
        time: "21:00",
        available: 120,
      },
    ]

    const result = await db.collection("tickets").insertMany(sampleTickets)

    revalidatePath("/")
    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to seed database:", error)
    return { success: false, error: "Failed to seed database" }
  }
}
