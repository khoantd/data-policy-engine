import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "px-2.5 py-1.5 text-sm" : "px-3.5 py-2 text-sm",
        variant === "primary" &&
          "bg-primary text-primary-fg hover:bg-secondary",
        variant === "secondary" &&
          "bg-surface text-foreground border border-border hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "danger" &&
          "bg-destructive text-white hover:bg-destructive/90",
        className,
      )}
      {...props}
    />
  );
}
