"use client";

import { useActionState } from "react";
import { disconnectSteamAction } from "./actions";

export default function DisconnectSteamButton() {
    const [state, formAction, isPending] = useActionState(async () => {
        return await disconnectSteamAction();
    }, null);

    return (
        <form action={formAction}>
            <button
                type="submit"
                disabled={isPending}
                className="text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors flex items-center gap-1"
            >
                {isPending ? "Disconnecting..." : "Disconnect Steam"}
            </button>
            {state?.error && <p className="text-red-500 text-xs mt-1">{state.error}</p>}
        </form>
    );
}
