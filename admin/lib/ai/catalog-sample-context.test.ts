import { describe, expect, it } from "vitest";
import {
  applyCatalogSourceToRecord,
  formatCatalogContextForPrompt,
  trimProcessForSample,
  trimSystemForSample,
} from "@/lib/ai/catalog-sample-context";

describe("trimSystemForSample", () => {
  it("trims source_key and nulls blanks", () => {
    expect(
      trimSystemForSample({
        id: "sys_crm",
        name: "CRM",
        source_key: "  crm_system  ",
      }),
    ).toEqual({
      id: "sys_crm",
      name: "CRM",
      source_key: "crm_system",
    });
    expect(
      trimSystemForSample({ id: "sys_x", name: "X", source_key: "  " }),
    ).toEqual({ id: "sys_x", name: "X", source_key: null });
  });
});

describe("trimProcessForSample", () => {
  it("keeps id and name", () => {
    expect(trimProcessForSample({ id: "proc_a", name: "Onboarding" })).toEqual(
      { id: "proc_a", name: "Onboarding" },
    );
  });
});

describe("formatCatalogContextForPrompt", () => {
  it("returns empty when no catalog selected", () => {
    expect(formatCatalogContextForPrompt({})).toEqual([]);
  });

  it("instructs exact source when system has source_key", () => {
    const lines = formatCatalogContextForPrompt({
      system: { id: "sys_crm", name: "CRM", source_key: "crm_system" },
    });
    expect(lines.join("\n")).toContain("set record.source to this exact value");
    expect(lines.join("\n")).toContain("crm_system");
  });

  it("notes missing source_key and governance-only process", () => {
    const lines = formatCatalogContextForPrompt({
      system: { id: "sys_x", name: "X", source_key: null },
      process: { id: "proc_a", name: "Onboarding" },
    });
    expect(lines.join("\n")).toContain("no source_key");
    expect(lines.join("\n")).toContain("governance context only");
    expect(lines.join("\n")).toContain("proc_a");
  });
});

describe("applyCatalogSourceToRecord", () => {
  it("overrides source when system has source_key", () => {
    expect(
      applyCatalogSourceToRecord(
        { source: "other", data_type: "x" },
        { id: "sys", name: "S", source_key: "crm_system" },
      ),
    ).toEqual({ source: "crm_system", data_type: "x" });
  });

  it("leaves record unchanged without source_key", () => {
    const record = { source: "crm_system" };
    expect(
      applyCatalogSourceToRecord(record, {
        id: "sys",
        name: "S",
        source_key: null,
      }),
    ).toBe(record);
  });
});
