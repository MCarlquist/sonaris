import { createFileRoute } from '@tanstack/react-router'
import { getRecordings } from '@/lib/recordings';

export const Route = createFileRoute('/recordings')({
  loader: () => getRecordings(),
  component: RecordingsPage
})

function RecordingsPage() {
  const recordings = Route.useLoaderData()
  
  return (
    <div className='space-y-8'>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Recordings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your captured musical ideas.
        </p>
      </div>

      {recordings.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            No recordings yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium">
                    {recording.title}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {recording.duration}s
                  </p>
                </div>

                <audio
                  controls
                  src={recording.audioUrl}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}