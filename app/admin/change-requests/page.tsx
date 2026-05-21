import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { ChangeRequestsList } from "@/components/admin/change-requests-list";

export const metadata = { title: "Change requests · Admin" };

export default async function ChangeRequestsInbox() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("change_requests")
    .select("*, requested_by_profile:profiles!change_requests_requested_by_fkey(full_name, email), projects(name)")
    .order("created_at", { ascending: false });

  const open = items?.filter((cr) => cr.status === "open").length ?? 0;
  return (
    <div className="container-wide py-10">
      <PageHeader
        title="Change requests"
        description={`${open} open · ${items?.length ?? 0} total`}
      />
      <ChangeRequestsList items={items ?? []} showProject />
    </div>
  );
}
