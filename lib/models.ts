import type { ObjectId } from "mongodb"

export interface Ticket {
  _id?: ObjectId
  name: string
  description: string
  price: number
  date: string
  time: string
  available: number
}

export interface Booking {
  _id?: ObjectId
  ticketId: ObjectId
  ticketName: string
  customerName: string
  customerEmail: string
  quantity: number
  totalPrice: number
  bookingDate: string
  status: "confirmed" | "cancelled"
}
