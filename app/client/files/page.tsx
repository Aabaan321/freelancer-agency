import { FileText, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Files · Client" };

export default async function ClientFilesPage() {
  const supabase = await createClient();
  const { data: files } = await supabase
    .from("deliverables")
    .select("*, projects(name)")
    .eq("client_visible", true)
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Files" description="Deliverables your team has shared with you." />

      {(files?.length ?? 0) === 0 ? (
        <Card className="p-16 text-center">
          <FileText className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
          <h3 className="font-serif text-2xl">No files yet</h3>
          <p className="mt-2 text-sm text-ink-muted">When we upload deliverables, you&apos;ll find them here.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-line overflow-hidden">
          {files!.map((f) => (
            <div key={f.id} className="p-4 flex items-center gap-4">
              <FileText className="h-5 w-5 text-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{f.file_name}</div>
                <div className="text-xs text-ink-subtle">{formatDate(f.created_at)}</div>
              </div>
              <a
                href={`/api/files/${f.id}`}
                className="h-9 w-9 rounded-lg border border-line grid place-items-center text-ink-muted hover:text-gold hover:border-gold/40 transition-colors"
                aria-label="Download"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
