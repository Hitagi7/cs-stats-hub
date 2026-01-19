import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--cs2-bg)] text-white px-4">
            {/* Glowing 404 */}
            <div className="relative mb-8">
                <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] leading-none">
                    404
                </h1>
                <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
            </div>

            {/* Message */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                Target Not Found
            </h2>
            <p className="text-[var(--text-secondary)] text-center max-w-md mb-8">
                Looks like this page went AFK. The URL you're looking for doesn't exist or has been moved.
            </p>

            {/* Actions */}
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 rounded-lg bg-[var(--cs2-surface)] border border-[var(--cs2-border)] hover:border-[var(--primary)] transition-colors"
                >
                    Go Home
                </Link>
                <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] font-medium hover:opacity-90 transition-opacity"
                >
                    Dashboard
                </Link>
            </div>

            {/* Decorative crosshair */}
            <div className="mt-16 opacity-20">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2" />
                    <line x1="30" y1="0" x2="30" y2="20" stroke="currentColor" strokeWidth="2" />
                    <line x1="30" y1="40" x2="30" y2="60" stroke="currentColor" strokeWidth="2" />
                    <line x1="0" y1="30" x2="20" y2="30" stroke="currentColor" strokeWidth="2" />
                    <line x1="40" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="2" />
                    <circle cx="30" cy="30" r="4" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
}
