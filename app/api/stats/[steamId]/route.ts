import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ steamId: string }> }
) {
    const { steamId } = await params;
    const supabase = await createClient();

    try {
        // First try to get from cache (database)
        const { data: cachedStats, error: cacheError } = await supabase
            .from("player_stats")
            .select("*")
            .eq("steam_id", steamId)
            .single();

        if (cachedStats && !cacheError) {
            // Check if cache is fresh (less than 1 hour old)
            const lastUpdated = new Date(cachedStats.last_updated);
            const now = new Date();
            const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

            if (hoursDiff < 1) {
                return NextResponse.json({
                    success: true,
                    data: cachedStats,
                    source: "cache",
                });
            }
        }

        // TODO: Fetch from Steam API when available
        // For now, return cached data or mock data
        if (cachedStats) {
            return NextResponse.json({
                success: true,
                data: cachedStats,
                source: "cache",
            });
        }

        // Return placeholder data if no cache exists
        return NextResponse.json({
            success: true,
            data: {
                steam_id: steamId,
                username: `Player_${steamId.slice(-4)}`,
                kd_ratio: null,
                win_rate: null,
                headshot_percentage: null,
                matches_played: 0,
                total_kills: 0,
                total_deaths: 0,
                message: "Steam API integration pending. This is placeholder data.",
            },
            source: "placeholder",
        });
    } catch (error) {
        console.error("Error fetching player stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch player stats" },
            { status: 500 }
        );
    }
}
