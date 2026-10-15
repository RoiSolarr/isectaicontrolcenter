import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const COMMANDS = `supabase start        # local Postgres + Auth (needs Docker)
supabase db reset     # runs supabase/migrations, then supabase/seed.sql
npm run db:types      # regenerates src/types/database.ts`

/** How anyone can rebuild the database and the sample data. */
export function ReproduceCard() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Reproduce this database</CardTitle>
          <CardDescription>Migrations and a seed file rebuild the schema and the fictional sample data with one command.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
          <code>{COMMANDS}</code>
        </pre>
        <p className="text-xs leading-relaxed text-muted-foreground">
          The sample data is fictional: two medical clinics and one service business. Setup steps for a hosted Supabase project are in the README.
        </p>
      </CardContent>
    </Card>
  )
}