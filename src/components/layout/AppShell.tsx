import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}