import { generateCS2Analysis } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
        const { prompt, statsContext, favoritesContext } = body;

        if (!prompt) {
            return NextResponse.json(
                { success: false, error: "Prompt is required" },
                { status: 400 }
            );
        }

        const analysis = await generateCS2Analysis(prompt, statsContext, favoritesContext);

        return NextResponse.json({
            success: true,
            data: analysis,
        });

    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to generate analysis" },
            { status: 500 }
        );
    }
}
