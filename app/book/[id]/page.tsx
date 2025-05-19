import { getTicketById } from "@/app/actions/ticket-actions"
import BookingForm from "@/components/booking-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BookingPageProps {
  params: {
    id: string
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { success, data: ticket, error } = await getTicketById(params.id)

  if (!success || !ticket) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">← Back to tickets</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Book Ticket: {ticket.name}</CardTitle>
          <CardDescription>{ticket.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(ticket.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{ticket.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">Price per ticket</div>
              <div className="text-lg font-bold">${ticket.price.toFixed(2)}</div>
            </div>

            <BookingForm ticket={ticket} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
