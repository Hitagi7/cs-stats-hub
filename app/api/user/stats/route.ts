import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Fetch current user's aggregated stats
export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    // Get user's favorites count
    const { count: favoritesCount } = await supabase
        .from("user_favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

    return NextResponse.json({
        success: true,
        data: {
            user_id: user.id,
            email: user.email,
            favorites_count: favoritesCount || 0,
            // TODO: Add more user-specific stats when Steam integration is complete
            stats_summary: {
                message: "Connect your Steam account to see your stats",
            },
        },
    });
}
