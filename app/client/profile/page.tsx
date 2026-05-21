import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Profile · Client" };

export default async function ClientProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();

  return (
    <div className="container-wide py-10 max-w-2xl">
      <PageHeader title="Profile" description="Your account details." />
      <Card className="p-8">
        <h3 className="font-serif text-xl">Account</h3>
        <Separator className="my-4" />
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-ink-subtle">Name</dt><dd>{profile?.full_name ?? "—"}</dd>
          <dt className="text-ink-subtle">Email</dt><dd className="font-mono">{profile?.email}</dd>
          <dt className="text-ink-subtle">Role</dt><dd className="uppercase tracking-wider text-gold text-xs">{profile?.role}</dd>
          <dt className="text-ink-subtle">Phone</dt><dd>{profile?.phone ?? "—"}</dd>
        </dl>
      </Card>
    </div>
  );
}
