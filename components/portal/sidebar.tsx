"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageCircle,
  Inbox,
  Receipt,
  Settings,
  LogOut,
  ChevronLeft,
  Sparkles,
  FileText,
  User as UserIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Change requests", href: "/admin/change-requests", icon: Inbox },
  { label: "Messages", href: "/admin/messages", icon: MessageCircle },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const CLIENT_NAV = [
  { label: "Dashboard", href: "/client", icon: LayoutDashboard, exact: true },
  { label: "Projects", href: "/client/projects", icon: FolderKanban },
  { label: "Files", href: "/client/files", icon: FileText },
  { label: "Messages", href: "/client/messages", icon: MessageCircle },
  { label: "Invoices", href: "/client/invoices", icon: Receipt },
  { label: "Profile", href: "/client/profile", icon: UserIcon },
];

export function Sidebar({
  variant,
  user,
}: {
  variant: "admin" | "client";
  user: { email: string; full_name: string | null; role: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = variant === "admin" ? ADMIN_NAV : CLIENT_NAV;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-line bg-bg-elevated/40 backdrop-blur-sm">
      <div className="p-6 border-b border-line">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold via-gold-muted to-gold/60 grid place-items-center">
            <span className="font-serif text-bg font-bold">A</span>
          </div>
          <div>
            <div className="font-serif text-lg leading-none">Aureon</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gold mt-1">
              {variant === "admin" ? "Admin" : "Client portal"}
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors group",
                active ? "text-gold" : "text-ink-muted hover:text-ink hover:bg-bg-subtle",
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-gold")} />
              <span>{item.label}</span>
              {active && (
                <motion.span
                  layoutId={`sidebar-${variant}`}
                  className="absolute inset-0 -z-10 rounded-lg bg-gold/10 border border-gold/20"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-line">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 grid place-items-center text-xs font-medium text-gold">
            {(user.full_name ?? user.email).slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs truncate text-ink">{user.full_name ?? user.email}</div>
            <div className="text-[10px] uppercase tracking-wider text-ink-subtle">{user.role}</div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-ink-muted hover:text-danger hover:bg-bg-subtle transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </aside>
  );
}
