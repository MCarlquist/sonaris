import {
  BarVisualizer,
  useMultibandVolume,
} from '@/components/ui/bar-visualizer'

interface AudioVisualizerProps {
  stream: MediaStream | null
}

export function AudioVisualizer({
  stream,
}: AudioVisualizerProps) {

  return (
    <BarVisualizer
      state={stream ? 'speaking' : 'connecting'}
      mediaStream={stream}
      demo={!stream}
      barCount={24}
      minHeight={15}
      maxHeight={90}
      className="h-40 w-full"
    />
  )
}