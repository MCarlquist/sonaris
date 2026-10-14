import { createFileRoute } from '@tanstack/react-router'
import { getRecordings } from '@/lib/recordings';
import { ChordAnalysisPanel } from "@/components/audio/ChordAnalysisPanel";

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
              className="space-y-4 border-b pb-4 last:border-b-0"
            >
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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

              <ChordAnalysisPanel recording={recording} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}