import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { NewClientForm } from "./new-client-form";

export const metadata = { title: "Add client · Admin" };

export default function NewClientPage() {
  return (
    <div className="container-wide py-10">
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-neon-cyan transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> All clients
      </Link>
      <PageHeader title="Add a client" description="Creates the client, a login, and an optional starter project." />
      <NewClientForm />
    </div>
  );
}
