"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Project, Feature, BudgetItem, DesignAsset, PreviewLink, Invoice, Contract, ChangeRequest, Message,
} from "@/lib/supabase/types";
import { FeatureChecklist } from "./feature-checklist";
import { BudgetPanel } from "./budget-panel";
import { DesignGallery } from "./design-gallery";
import { PreviewPanel } from "./preview-panel";
import { InvoicesPanel } from "./invoices-panel";
import { ContractPanel } from "./contract-panel";
import { ChangeRequestsPanel } from "./change-requests-panel";
import { MessagesPanel } from "./messages-panel";
import { RealtimeRefresh } from "./realtime-refresh";

type MessageRow = Message & { sender?: { full_name: string | null; email: string; role: string } | null };

export function ProjectWorkspace({
  project,
  features,
  budget,
  assets,
  previews,
  invoices,
  contracts,
  changeRequests,
  messages,
  currentUserId,
  canManage,
}: {
  project: Project;
  features: Feature[];
  budget: BudgetItem[];
  assets: DesignAsset[];
  previews: PreviewLink[];
  invoices: Invoice[];
  contracts: Contract[];
  changeRequests: ChangeRequest[];
  messages: MessageRow[];
  currentUserId: string;
  canManage: boolean;
}) {
  const cur = project.currency ?? "AED";
  return (
    <>
      <RealtimeRefresh projectId={project.id} />
      <Tabs defaultValue="checklist">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent border-0 p-0">
          {[
            ["checklist", "Checklist"],
            ["budget", "Budget"],
            ["design", "Design"],
            ["preview", "Preview"],
            ["invoices", "Invoices"],
            ["contract", "Contract"],
            ["changes", "Change requests"],
            ["messages", "Messages"],
          ].map(([v, label]) => (
            <TabsTrigger key={v} value={v} className="glass rounded-full data-[state=active]:border-iridescent data-[state=active]:bg-transparent">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="checklist"><FeatureChecklist features={features} projectId={project.id} canManage={canManage} /></TabsContent>
        <TabsContent value="budget"><BudgetPanel items={budget} projectId={project.id} currency={cur} canManage={canManage} /></TabsContent>
        <TabsContent value="design"><DesignGallery assets={assets} projectId={project.id} canManage={canManage} /></TabsContent>
        <TabsContent value="preview"><PreviewPanel links={previews} projectId={project.id} canManage={canManage} /></TabsContent>
        <TabsContent value="invoices"><InvoicesPanel invoices={invoices} projectId={project.id} clientId={project.client_id} currency={cur} canManage={canManage} /></TabsContent>
        <TabsContent value="contract"><ContractPanel contracts={contracts} projectId={project.id} clientId={project.client_id} canManage={canManage} /></TabsContent>
        <TabsContent value="changes"><ChangeRequestsPanel items={changeRequests} projectId={project.id} canManage={canManage} /></TabsContent>
        <TabsContent value="messages"><MessagesPanel messages={messages} projectId={project.id} currentUserId={currentUserId} /></TabsContent>
      </Tabs>
    </>
  );
}
