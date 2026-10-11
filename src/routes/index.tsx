import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm text-muted-foreground">
          Welcome back
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Capture the idea before it disappears.
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Record a musical idea, organize your recordings, and develop
          them into songs.
        </p>

        <div className="mt-6">
          <Button asChild>
            <Link to='/studio'>
              + Capture an idea
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Recent recordings
          </h2>

          <p className="text-sm text-muted-foreground">
            Your latest musical ideas.
          </p>
        </div>

        <div className="rounded-lg border">
          <div className="p-6 text-sm text-muted-foreground">
            No recordings yet.
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Songs
          </h2>

          <p className="text-sm text-muted-foreground">
            Songs you're currently developing.
          </p>
        </div>

        <div className="rounded-lg border">
          <div className="p-6 text-sm text-muted-foreground">
            No songs yet.
          </div>
        </div>
      </section>
    </div>
  )
}