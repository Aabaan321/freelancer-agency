import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { NewClientForm } from "./new-client-form";

export const metadata = { title: "Add client · Admin" };

export default function NewClientPage() {
  return (
    <div className="container-wide py-10 max-w-3xl">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      <PageHeader
        title="Add a new client"
        description="Creates their account, sends them their portal credentials, and optionally seeds a starter project."
      />

      <Card className="p-8">
        <NewClientForm />
      </Card>
    </div>
  );
}
