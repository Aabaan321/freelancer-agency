"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createClientAction, type NewClientFormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
  let out = "";
  for (let i = 0; i < 14; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Creating…
        </>
      ) : (
        "Create client & send credentials"
      )}
    </Button>
  );
}

export function NewClientForm() {
  const [state, formAction] = useActionState<NewClientFormState, FormData>(createClientAction, {});
  const [password, setPassword] = useState("");

  useEffect(() => {
    setPassword(generatePassword());
  }, []);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      <section>
        <h3 className="font-serif text-lg mb-4">Client organization</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="block mb-2">Display name *</Label>
            <Input id="name" name="name" required placeholder="e.g. Nexora Labs" />
          </div>
          <div>
            <Label htmlFor="company" className="block mb-2">Legal company</Label>
            <Input id="company" name="company" placeholder="e.g. Nexora Labs FZ-LLC" />
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="font-serif text-lg mb-4">Primary contact</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_name" className="block mb-2">Full name *</Label>
            <Input id="contact_name" name="contact_name" required placeholder="Maya Saric" />
          </div>
          <div>
            <Label htmlFor="contact_email" className="block mb-2">Email *</Label>
            <Input id="contact_email" name="contact_email" type="email" required placeholder="maya@nexora.com" />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="temp_password" className="block mb-2">Temporary password *</Label>
          <div className="flex gap-2">
            <Input
              id="temp_password"
              name="temp_password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-mono text-sm"
            />
            <Button type="button" variant="outline" onClick={() => setPassword(generatePassword())}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-ink-subtle">
            Share this password with the client out-of-band. They&apos;ll change it on first login.
          </p>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="font-serif text-lg mb-4">Starter project (optional)</h3>
        <div>
          <Label htmlFor="project_name" className="block mb-2">Project name</Label>
          <Input id="project_name" name="project_name" placeholder="Marketing site v2" />
          <p className="mt-2 text-xs text-ink-subtle">
            We&apos;ll auto-create 4 default milestones (Discovery, Design, Build, Launch) and 3 starter tasks.
          </p>
        </div>
      </section>

      <Separator />

      <section>
        <Label htmlFor="notes" className="block mb-2">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Internal notes about this client…" />
      </section>

      <div className="flex justify-end">
        <SubmitBtn />
      </div>
    </form>
  );
}
