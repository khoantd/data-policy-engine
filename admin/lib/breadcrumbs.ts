export type BreadcrumbSegment = {
  label: string;
  href?: string;
};

const ROUTE_LABELS: Record<string, string> = {
  "": "Overview",
  policies: "Policies",
  import: "Create Policy",
  graph: "Structure graph",
  dsar: "DSAR",
  audit: "Audit",
  insights: "Insights",
  webhooks: "Webhooks",
  systems: "Systems",
  processes: "Processes",
  evaluate: "Evaluate",
  classify: "Scan",
  observability: "Observability",
  enforce: "Enforce",
  "grace-holds": "Grace holds",
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
