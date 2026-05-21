"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeRequestDialog } from "@/components/client/change-request-dialog";

export function RequestChangesButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <MessageSquarePlus className="h-4 w-4" /> Request changes
      </Button>
      <ChangeRequestDialog open={open} onOpenChange={setOpen} projectId={projectId} />
    </>
  );
}
