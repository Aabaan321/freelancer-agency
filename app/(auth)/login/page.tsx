import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-mesh-gold opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] -z-10 rounded-full"
           style={{ background: "radial-gradient(circle, hsl(43 55% 54% / 0.15), transparent 60%)" }} />

      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold via-gold-muted to-gold/60 grid place-items-center">
            <span className="font-serif text-bg font-bold">A</span>
          </div>
          <span className="font-serif text-xl">Aureon Studio</span>
        </Link>

        <div className="rounded-2xl border border-line bg-bg-elevated/60 backdrop-blur-xl p-8 shadow-2xl">
          <h1 className="font-serif text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-muted">Sign in to your client portal.</p>

          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-xs text-ink-subtle text-center">
            Don&apos;t have an account?{" "}
            <Link href="/contact" className="text-gold hover:text-gold-muted">
              Get in touch
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-ink-subtle">
          <Link href="/" className="hover:text-ink-muted">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
