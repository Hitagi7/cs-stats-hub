import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FavoritesClient from "./favorites-client";

export default async function FavoritesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <FavoritesClient user={user} />;
}
