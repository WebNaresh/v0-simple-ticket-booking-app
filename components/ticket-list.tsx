import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { Ticket } from "@/lib/models"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, TicketIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TicketListProps {
  tickets: Ticket[]
}

export default function TicketList({ tickets }: TicketListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <Card key={ticket._id?.toString()} className="flex flex-col">
          <CardHeader>
            <CardTitle>{ticket.name}</CardTitle>
            <CardDescription>{ticket.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(ticket.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{ticket.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <TicketIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {ticket.available > 0 ? (
                    <Badge variant="outline" className="bg-green-50">
                      {ticket.available} available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50">
                      Sold out
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-lg font-bold">${ticket.price.toFixed(2)}</div>
            <Button asChild disabled={ticket.available <= 0}>
              <Link href={`/book/${ticket._id}`}>Book Now</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
