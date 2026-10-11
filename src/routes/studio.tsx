import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Recorder } from '#/components/audio/Recorder'
import { AudioVisualizer } from '#/components/audio/AudioVisualizer'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/studio')({
  component: StudioPage,
})

function StudioPage() {

  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }, [stream])

  async function enableMicrophone() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })

    setStream(mediaStream)
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-muted-foreground">
          Studio
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Capture an idea
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Record a musical idea before it disappears.
        </p>
      </section>

      <section className='rounded-xl border p-8'>
        <AudioVisualizer stream={stream} />
        {!stream && (
          <div className='flex justify-center pt-3'>
            <Button onClick={enableMicrophone}>
              Enable Microphone
            </Button>
          </div>
        )}
      </section>

      <section className="rounded-xl border p-8">
        <Recorder stream={stream} />
      </section>
    </div>
  )
}