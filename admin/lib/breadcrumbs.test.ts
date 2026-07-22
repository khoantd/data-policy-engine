import { describe, expect, it } from "vitest";
import { buildBreadcrumbs } from "./breadcrumbs";

describe("buildBreadcrumbs", () => {
  it("returns overview for root", () => {
    expect(buildBreadcrumbs("/")).toEqual([
      { label: "ROS Policy", href: "/" },
      { label: "Overview" },
    ]);
  });

  it("builds policies trail", () => {
    expect(buildBreadcrumbs("/policies")).toEqual([
      { label: "ROS Policy", href: "/" },
      { label: "Policies" },
    ]);
  });

  it("builds nested policy detail with tail label", () => {
    expect(
      buildBreadcrumbs("/policies/my-policy", { tailLabel: "my-policy" }),
    ).toEqual([
      { label: "ROS Policy", href: "/" },
      { label: "Policies", href: "/policies" },
      { label: "my-policy" },
    ]);
  });

  it("builds import under policies", () => {
    expect(buildBreadcrumbs("/policies/import")).toEqual([
      { label: "ROS Policy", href: "/" },
      { label: "Policies", href: "/policies" },
      { label: "Import" },
    ]);
  });
});
