import { Download, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";

export const metadata = { title: "Files · Client" };

function fmtSize(bytes: number | null) {
  if (!bytes) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0, n = bytes;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${u[i]}`;
}

export default async function ClientFiles() {
  const supabase = await createClient();
  const { data: files } = await supabase.from("deliverables").select("*, project:projects(name)").order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Files" description="Deliverables your studio has shared." />
      <div className="space-y-2">
        {(files ?? []).map((f) => {
          const proj = (f as { project?: { name?: string } }).project?.name;
          return (
            <a key={f.id} href={f.file_path} target="_blank" rel="noopener noreferrer" className="glass rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors">
              <div className="h-10 w-10 rounded-lg glass grid place-items-center"><FileText className="h-4 w-4 text-ink-muted" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{f.file_name}</div>
                <div className="text-xs text-ink-subtle">{proj}{f.size_bytes ? ` · ${fmtSize(f.size_bytes)}` : ""}</div>
              </div>
              <Download className="h-4 w-4 text-ink-subtle" />
            </a>
          );
        })}
        {(files ?? []).length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <FileText className="h-9 w-9 mx-auto text-ink-subtle opacity-40 mb-3" />
            <p className="text-sm text-ink-muted">No files shared yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
