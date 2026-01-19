"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserStats } from "@/lib/stats";

/**
 * Hook to subscribe to realtime updates for a user's player stats
 * @param initialStats - Initial stats from server fetch
 * @param steamId - The Steam ID to subscribe to (optional)
 * @returns Updated stats that refresh automatically
 */
export function useRealtimeStats(
    initialStats: UserStats | null,
    steamId?: string
): UserStats | null {
    const [stats, setStats] = useState<UserStats | null>(initialStats);
    const supabase = createClient();

    useEffect(() => {
        // Sync with initial stats when they change
        setStats(initialStats);
    }, [initialStats]);

    useEffect(() => {
        // Only subscribe if we have a Steam ID to listen for
        const targetSteamId = steamId || initialStats?.steam_id;
        if (!targetSteamId) return;

        // Create a channel for realtime subscription
        const channel = supabase
            .channel(`player_stats_${targetSteamId}`)
            .on(
                "postgres_changes",
                {
                    event: "*", // Listen to INSERT, UPDATE, DELETE
                    schema: "public",
                    table: "player_stats",
                    filter: `steam_id=eq.${targetSteamId}`,
                },
                (payload) => {
                    console.log("Realtime stats update:", payload);

                    if (payload.eventType === "DELETE") {
                        setStats(null);
                    } else {
                        // payload.new contains the updated row
                        setStats(payload.new as UserStats);
                    }
                }
            )
            .subscribe((status) => {
                console.log("Realtime subscription status:", status);
            });

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [steamId, initialStats?.steam_id, supabase]);

    return stats;
}
