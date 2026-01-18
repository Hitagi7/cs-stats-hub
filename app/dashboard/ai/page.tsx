import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AIClient from "./ai-client";

export default async function AIPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <AIClient user={user} />;
}
