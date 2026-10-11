import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/songs')({
  component: SongsPage,
})

function SongsPage() {
  return (
    <div>
      <h1>Songs</h1>
      <p>Your songs will appear here.</p>
    </div>
  )
}