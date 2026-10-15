import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/** Friendly red card for a failed data load. `message` is the raw database error, shown small so it is easy to debug. */
export function SectionError({ title, message }: { title: string; message: string }) {
  return (
    <Alert variant="destructive" role="alert">
      <AlertTriangle aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message.replace(/\.$/, '')}. Check the Supabase connection and that the migrations and seed data have been applied, then reload the page.
      </AlertDescription>
    </Alert>
  )
}