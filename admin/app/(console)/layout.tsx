import { ConsoleShell } from "@/components/console-shell";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUrl = process.env.DRPE_API_URL || "http://127.0.0.1:8000";
  return <ConsoleShell apiUrl={apiUrl}>{children}</ConsoleShell>;
}
