import Link from "next/link";

export function AiTracingFootnote() {
  return (
    <p className="text-xs text-muted-fg" role="status">
      LangSmith tracing is on.{" "}
      <Link
        href="/observability"
        className="text-secondary hover:underline cursor-pointer"
      >
        View traces in Observability
      </Link>
      .
    </p>
  );
}
