import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { initials } from "@/lib/utils";

export const metadata = { title: "Profile · Client" };

export default async function ClientProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: clients } = await supabase.from("clients").select("name, company");

  return (
    <div className="container-wide py-10">
      <PageHeader title="Profile" description="Your account details." />
      <div className="glass rounded-2xl p-6 max-w-xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-iridescent grid place-items-center text-xl font-semibold text-bg">
            {initials(profile?.full_name ?? user.email ?? "?")}
          </div>
          <div>
            <div className="font-serif text-2xl">{profile?.full_name ?? "—"}</div>
            <div className="text-sm text-ink-muted">{user.email}</div>
          </div>
        </div>
        <dl className="mt-6 space-y-3 text-sm">
          {[
            ["Role", profile?.role ?? "client"],
            ["Currency", profile?.currency ?? "AED"],
            ["Organisation", (clients ?? [])[0]?.name ?? "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/5 pb-2">
              <dt className="text-ink-subtle">{k}</dt>
              <dd className="text-ink capitalize">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
