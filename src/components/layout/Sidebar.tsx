import { Link } from '@tanstack/react-router'

export function Sidebar() {
    return (
        <aside className="flex w-64 flex-col border-r bg-muted/20">
            <div className="border-b p-6">
                <h1 className="text-xl font-semibold tracking-tight">
                    Sonaris
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Capture the idea.
                </p>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    <Link
                        to="/"
                        activeProps={{
                            className: 'bg-muted font-medium',
                        }}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                        Home
                    </Link>

                    <Link
                        to="/studio"
                        activeProps={{
                            className: 'bg-muted font-medium',
                        }}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                        Studio
                    </Link>

                    <Link
                        to="/recordings"
                        activeProps={{
                            className: 'bg-muted font-medium',
                        }}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                        Recordings
                    </Link>

                    <Link
                        to="/songs"
                        activeProps={{
                            className: 'bg-muted font-medium',
                        }}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                        Songs
                    </Link>
                </div>
            </nav>

            <div className="border-t p-4">
                <Link
                    to="/settings"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                    Settings
                </Link>
            </div>
        </aside>
    )
}