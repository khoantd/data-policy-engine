import Link from "next/link";

export function AiPrivacyFootnote() {
  return (
    <p className="text-xs text-muted-fg" role="status">
      Sensitive fields are masked before the model sees them.{" "}
      <Link
        href="/observability"
        className="text-secondary hover:underline cursor-pointer"
      >
        Check privacy status in Observability
      </Link>
      .
    </p>
  );
}
