import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { saveRecording } from '@/lib/recordings'

interface RecorderProps {
    stream: MediaStream | null
}

export function Recorder({ stream }: RecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
    const [recordingTitle, setRecordingTitle] = useState('Untitled recording')
    const [recordingDuration, setRecordingDuration] = useState(0)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const recorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const startedAtRef = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
            }
        }
    }, [audioUrl])

    useEffect(() => {
        if (!isRecording) {
            return
        }

        const interval = window.setInterval(() => {
            setElapsedTime((time) => time + 1)
        }, 1000)

        return () => {
            window.clearInterval(interval)
        }
    }, [isRecording])

    function startRecording() {
        if (!stream) {
            return
        }

        chunksRef.current = []

        const recorder = new MediaRecorder(stream)

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data)
            }
        }

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, {
                type: recorder.mimeType,
            })

            const url = URL.createObjectURL(blob)

            const duration = startedAtRef.current
                ? Math.floor((Date.now() - startedAtRef.current) / 1000,) : 0

            setRecordingBlob(blob)
            setRecordingDuration(duration)
            setAudioUrl(url)
        }

        recorderRef.current = recorder

        setElapsedTime(0)
        setIsRecording(true)

        startedAtRef.current = Date.now()
        recorder.start()
    }

    function stopRecording() {
        recorderRef.current?.stop()
        setIsRecording(false)
    }

    function resetRecording() {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl)
        }

        setAudioUrl(null)
        setRecordingBlob(null)
        setRecordingTitle('Untitled recording')
        setRecordingDuration(0)
        setElapsedTime(0)
        setIsSaved(false)
        setSaveError(null)
        chunksRef.current = []
        recorderRef.current = null
    }

    async function handleSaveRecording() {
        if (!recordingBlob || isSaving || isSaved) {
            return
        }

        setIsSaving(true)
        setSaveError(null)

        try {
            await saveRecording(
                recordingBlob,
                recordingTitle.trim() || 'Untitled recording',
                recordingDuration,
            )
            setIsSaved(true)
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Could not save recording')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-3xl font-mono">
                    {Math.floor(elapsedTime / 60)
                        .toString()
                        .padStart(2, '0')}
                    :
                    {(elapsedTime % 60).toString().padStart(2, '0')}
                </p>
            </div>

            <div className="flex justify-center gap-3">
                {!isRecording ? (
                    <Button
                        onClick={startRecording}
                        disabled={!stream}
                    >
                        Start recording
                    </Button>
                ) : (
                    <Button onClick={stopRecording}>
                        Stop recording
                    </Button>
                )}

                {audioUrl && !isRecording && (
                    <Button
                        variant="outline"
                        onClick={resetRecording}
                    >
                        Record again
                    </Button>
                )}
            </div>

            {audioUrl && (
                <div className="space-y-4">
                    <audio
                        controls
                        src={audioUrl}
                        className="w-full"
                    />
                    <label className="block space-y-2 text-sm font-medium">
                        Recording title
                        <input
                            value={recordingTitle}
                            onChange={(event) => setRecordingTitle(event.target.value)}
                            disabled={isSaving || isSaved}
                            className="h-9 w-full rounded-md border bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
                        />
                    </label>
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            onClick={handleSaveRecording}
                            disabled={isSaving || isSaved}
                        >
                            {isSaving ? 'Saving...' : isSaved ? 'Saved to Supabase' : 'Save to Supabase'}
                        </Button>
                        {saveError && (
                            <p role="alert" className="text-sm text-destructive">
                                {saveError}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}