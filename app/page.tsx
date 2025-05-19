import { getTickets, seedTickets } from "./actions/ticket-actions"
import TicketList from "@/components/ticket-list"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const { success, data: tickets, error } = await getTickets()

  // If no tickets are found, we'll show a button to seed the database
  const isEmpty = success && (!tickets || tickets.length === 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Available Tickets</h1>
        {isEmpty && (
          <form action={seedTickets}>
            <Button type="submit">Seed Sample Tickets</Button>
          </form>
        )}
      </div>

      {!success && <p className="text-red-500">{error}</p>}

      {success && isEmpty && (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold">No tickets available</h2>
          <p className="mt-2 text-muted-foreground">Click the button above to add sample tickets to get started.</p>
        </div>
      )}

      {success && tickets && tickets.length > 0 && <TicketList tickets={tickets} />}
    </div>
  )
}
