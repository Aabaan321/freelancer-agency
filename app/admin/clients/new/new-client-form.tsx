"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createClientAction, type NewClientFormState } from "@/app/actions";
import { Button } from "@/components/ui/button";

const initial: NewClientFormState = {};

export function NewClientForm() {
  const [state, action, pending] = useActionState(createClientAction, initial);

  return (
    <form action={action} className="glass rounded-2xl p-6 space-y-4 max-w-2xl">
      {state.error && <div className="rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">{state.error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field name="name" label="Client / brand name" required />
        <Field name="company" label="Company (optional)" />
        <Field name="contact_name" label="Primary contact name" />
        <Field name="contact_email" label="Contact email" type="email" required />
        <Field name="temp_password" label="Temporary password" type="text" required hint="Min 8 characters — share securely" />
        <Field name="project_name" label="Starter project (optional)" hint="Seeds milestones + a checklist" />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create client + login"}
      </Button>
      <p className="text-xs text-ink-subtle">
        This provisions a real login for the client. Requires <code className="text-ink-muted">SUPABASE_SERVICE_ROLE_KEY</code> in <code className="text-ink-muted">.env.local</code>.
      </p>
    </form>
  );
}

function Field({ name, label, type = "text", required, hint }: { name: string; label: string; type?: string; required?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-ink-muted">{label}{required && <span className="text-danger"> *</span>}</span>
      <input name={name} type={type} required={required} className="mt-1 w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-neon-violet/40" />
      {hint && <span className="text-[11px] text-ink-subtle mt-1 block">{hint}</span>}
    </label>
  );
}
