"use client";

import { useActionState } from "react";
import { connectSteamAction } from "./actions";

export default function ConnectSteamForm() {
    const [state, formAction, isPending] = useActionState(connectSteamAction, null);

    return (
        <div className="glass rounded-2xl p-8 border border-[var(--cs2-border)] text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center mx-auto mb-4 border border-[var(--cs2-border)]">
                <svg className="w-8 h-8 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Connect Your Steam Account</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                Enter your Steam ID, Profile URL, or Vanity URL to automatically track your CS2 statistics and get personalized insights.
            </p>

            <form action={formAction} className="max-w-md mx-auto">
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="steamId"
                        placeholder="e.g. 76561198000000000 or custom_url"
                        className="bg-[var(--cs2-surface)] border border-[var(--cs2-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--cs2-orange)] transition-colors w-full"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn-primary w-full flex justify-center items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            "Connect Steam"
                        )}
                    </button>
                    {state?.error && (
                        <p className="text-red-400 text-sm">{state.error}</p>
                    )}
                </div>
            </form>
            <p className="text-xs text-[var(--text-muted)] mt-4">
                Your profile must be public for us to fetch stats.
            </p>
        </div>
    );
}
