import { createClient } from "@/lib/supabase/server";
import { getFullPlayerData } from "@/lib/steam/api";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ steamId: string }> }
) {
    const { steamId } = await params;
    const supabase = await createClient();

    try {
        // First check cache (database)
        const { data: cachedStats, error: cacheError } = await supabase
            .from("player_stats")
            .select("*")
            .eq("steam_id", steamId)
            .single();

        // Check if cache is fresh (less than 1 hour old)
        if (cachedStats && !cacheError) {
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

        // Check if Steam API key is configured
        if (!process.env.STEAM_API_KEY) {
            // Return cached data if available, otherwise placeholder
            if (cachedStats) {
                return NextResponse.json({
                    success: true,
                    data: cachedStats,
                    source: "cache",
                });
            }

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
                    message: "Steam API key not configured. Add STEAM_API_KEY to .env.local",
                },
                source: "placeholder",
            });
        }

        // Fetch fresh data from Steam API
        const steamData = await getFullPlayerData(steamId);

        if (!steamData.success) {
            // Return cached data if Steam API fails
            if (cachedStats) {
                return NextResponse.json({
                    success: true,
                    data: cachedStats,
                    source: "cache",
                    warning: steamData.error,
                });
            }

            return NextResponse.json(
                { success: false, error: steamData.error },
                { status: 404 }
            );
        }

        // At this point, steamData.success is true, so data exists
        const playerData = steamData.data!;

        // Update cache in database
        const { error: upsertError } = await supabase
            .from("player_stats")
            .upsert(
                {
                    steam_id: playerData.steam_id,
                    username: playerData.username,
                    avatar_url: playerData.avatar_url,
                    kd_ratio: playerData.kd_ratio,
                    win_rate: playerData.win_rate,
                    headshot_percentage: playerData.headshot_percentage,
                    matches_played: playerData.matches_played,
                    total_kills: playerData.total_kills,
                    total_deaths: playerData.total_deaths,
                    total_wins: playerData.total_wins,
                    total_losses: playerData.total_losses,
                    hours_played: playerData.hours_played,
                    last_updated: new Date().toISOString(),
                },
                {
                    onConflict: "steam_id",
                }
            );

        if (upsertError) {
            console.error("Error caching player stats:", upsertError);
        }

        return NextResponse.json({
            success: true,
            data: playerData,
            source: "steam_api",
        });
    } catch (error) {
        console.error("Error fetching player stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch player stats" },
            { status: 500 }
        );
    }
}
