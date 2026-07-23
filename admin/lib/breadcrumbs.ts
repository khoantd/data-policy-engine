export type BreadcrumbSegment = {
  label: string;
  href?: string;
};

const ROUTE_LABELS: Record<string, string> = {
  "": "Overview",
  policies: "Policies",
  import: "Import",
  dsar: "DSAR",
  audit: "Audit",
  insights: "Insights",
  webhooks: "Webhooks",
  evaluate: "Evaluate",
  classify: "Scan",
  observability: "Observability",
  enforce: "Enforce",
};

function titleCaseSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildBreadcrumbs(
  pathname: string,
  options?: { tailLabel?: string },
): BreadcrumbSegment[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbSegment[] = [{ label: "ROS Policy", href: "/" }];

  if (segments.length === 0) {
    crumbs.push({ label: "Overview" });
    return crumbs;
  }

  let path = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!;
    path += `/${segment}`;
    const isLast = i === segments.length - 1;
    const known = ROUTE_LABELS[segment];
    const label =
      isLast && options?.tailLabel
        ? options.tailLabel
        : known ?? titleCaseSegment(decodeURIComponent(segment));

    if (isLast) {
      crumbs.push({ label });
    } else {
      crumbs.push({ label, href: path });
    }
  }

  return crumbs;
}
