import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% -10%, #dbeafe 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, #fef3c7 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Policy Engine
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
            ROS Policy
          </h1>
          <p className="mt-2 text-sm text-muted-fg">
            Connect with your Bearer API key to manage policies, DSAR, audit,
            and enforcement.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <Suspense fallback={<p className="text-sm text-muted-fg">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
