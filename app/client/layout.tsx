import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/portal/sidebar";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "client") redirect("/admin");

  return (
    <div className="min-h-screen flex">
      <Sidebar variant="client" user={profile} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
