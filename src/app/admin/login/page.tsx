import { SiteHeader } from "@/components/SiteHeader";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-sm flex-1 px-4 py-16">
        <h1 className="text-xl font-semibold text-brand-navy-900">Admin login</h1>
        <p className="mt-2 text-sm text-brand-neutral-500">
          Demo metrics are behind a shared password — see <span className="font-medium">ARCHITECTURE.md</span>{" "}
          for how this works and its limits.
        </p>
        <LoginForm />
      </main>
    </div>
  );
}
