import { env } from '@/config/env'

/**
 * Temporary landing page for the foundation phase.
 * Will be replaced by auth-aware routing (middleware -> /login or /dashboard)
 * once authentication is implemented.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
        Foundation ready
      </span>
      <h1 className="text-3xl font-bold tracking-tight">{env.NEXT_PUBLIC_APP_NAME} Frontend</h1>
      <p className="max-w-md text-muted-foreground">
        Next.js App Router · TypeScript · TailwindCSS · TanStack Query · Zustand · Axios are wired
        and ready. Authentication and the dashboard shell come next.
      </p>
    </main>
  )
}
