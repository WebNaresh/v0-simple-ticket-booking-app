import Link from "next/link"
import { Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Ticket className="h-6 w-6" />
          <span className="text-xl font-bold">TicketBooker</span>
        </Link>
        <nav className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/bookings">My Bookings</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
