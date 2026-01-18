import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Fetch user's favorites
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

    const { data: favorites, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        data: favorites,
    });
}

// POST - Add a new favorite
export async function POST(request: Request) {
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

    try {
        const body = await request.json();
        const { steam_id, nickname, avatar_url } = body;

        if (!steam_id) {
            return NextResponse.json(
                { success: false, error: "steam_id is required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("user_favorites")
            .insert({
                user_id: user.id,
                steam_id,
                nickname,
                avatar_url,
            })
            .select()
            .single();

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json(
                    { success: false, error: "Player already in favorites" },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body" },
            { status: 400 }
        );
    }
}

// DELETE - Remove a favorite
export async function DELETE(request: Request) {
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

    try {
        const { searchParams } = new URL(request.url);
        const steam_id = searchParams.get("steam_id");

        if (!steam_id) {
            return NextResponse.json(
                { success: false, error: "steam_id is required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("user_favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("steam_id", steam_id);

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Favorite removed",
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request" },
            { status: 400 }
        );
    }
}
