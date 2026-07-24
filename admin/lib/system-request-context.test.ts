import { describe, expect, it } from "vitest";
import {
  MISSING_SOURCE_KEY_WARNING,
  applySystemToRequestFields,
  findProcessById,
  findSystemById,
  isGovernanceLinkedPolicy,
  parseProcessSearchParam,
  parseSystemSearchParam,
  processPlaygroundHref,
  resolveSystemSource,
  systemPlaygroundHref,
} from "@/lib/system-request-context";

const withKey = {
  id: "sys_crm",
  name: "CRM",
  source_key: "crm_system",
};

const withoutKey = {
  id: "sys_legacy",
  name: "Legacy ERP",
  source_key: null,
};

const blankKey = {
  id: "sys_blank",
  name: "Blank",
  source_key: "  ",
};

describe("resolveSystemSource", () => {
  it("returns trimmed source_key when present", () => {
    expect(resolveSystemSource(withKey)).toEqual({
      source: "crm_system",
    });
  });

  it("returns null source and warning when source_key missing", () => {
    expect(resolveSystemSource(withoutKey)).toEqual({
      source: null,
      warning: MISSING_SOURCE_KEY_WARNING,
    });
  });

  it("treats whitespace-only source_key as missing", () => {
    expect(resolveSystemSource(blankKey)).toEqual({
      source: null,
      warning: MISSING_SOURCE_KEY_WARNING,
    });
  });
});

describe("applySystemToRequestFields", () => {
  it("applies source when source_key is set", () => {
    expect(applySystemToRequestFields(withKey)).toEqual({
      source: "crm_system",
      sourceSynced: true,
    });
  });

  it("leaves source empty and flags warning when source_key missing", () => {
    expect(applySystemToRequestFields(withoutKey)).toEqual({
      source: "",
      sourceSynced: false,
      warning: MISSING_SOURCE_KEY_WARNING,
    });
  });
});

describe("findSystemById", () => {
  const systems = [withKey, withoutKey];

  it("returns matching system", () => {
    expect(findSystemById(systems, "sys_crm")).toEqual(withKey);
  });

  it("returns null for unknown or empty id", () => {
    expect(findSystemById(systems, "missing")).toBeNull();
    expect(findSystemById(systems, "")).toBeNull();
    expect(findSystemById(systems, null)).toBeNull();
    expect(findSystemById(systems, undefined)).toBeNull();
  });
});

describe("parseSystemSearchParam", () => {
  it("returns trimmed string param", () => {
    expect(parseSystemSearchParam("sys_crm")).toBe("sys_crm");
    expect(parseSystemSearchParam("  sys_crm  ")).toBe("sys_crm");
  });

  it("uses first array entry", () => {
    expect(parseSystemSearchParam(["sys_a", "sys_b"])).toBe("sys_a");
  });

  it("returns null for empty values", () => {
    expect(parseSystemSearchParam("")).toBeNull();
    expect(parseSystemSearchParam("   ")).toBeNull();
    expect(parseSystemSearchParam([])).toBeNull();
    expect(parseSystemSearchParam(undefined)).toBeNull();
    expect(parseSystemSearchParam(null)).toBeNull();
  });
});

describe("systemPlaygroundHref", () => {
  it("builds evaluate and classify deep links", () => {
    expect(systemPlaygroundHref("/evaluate", "sys_crm")).toBe(
      "/evaluate?system=sys_crm",
    );
    expect(systemPlaygroundHref("/classify", "sys_crm")).toBe(
      "/classify?system=sys_crm",
    );
  });

  it("encodes system id", () => {
    expect(systemPlaygroundHref("/evaluate", "sys/odd")).toBe(
      "/evaluate?system=sys%2Fodd",
    );
  });
});

describe("processPlaygroundHref", () => {
  it("builds evaluate and classify deep links", () => {
    expect(processPlaygroundHref("/evaluate", "proc_onboarding")).toBe(
      "/evaluate?process=proc_onboarding",
    );
    expect(processPlaygroundHref("/classify", "proc_onboarding")).toBe(
      "/classify?process=proc_onboarding",
    );
  });

  it("encodes process id", () => {
    expect(processPlaygroundHref("/evaluate", "proc/odd")).toBe(
      "/evaluate?process=proc%2Fodd",
    );
  });
});

describe("findProcessById", () => {
  const processes = [
    { id: "proc_a", name: "Onboarding" },
    { id: "proc_b", name: "Support" },
  ];

  it("returns matching process", () => {
    expect(findProcessById(processes, "proc_a")).toEqual(processes[0]);
  });

  it("returns null for unknown id", () => {
    expect(findProcessById(processes, "missing")).toBeNull();
  });
});

describe("parseProcessSearchParam", () => {
  it("parses process query the same as system", () => {
    expect(parseProcessSearchParam("proc_a")).toBe("proc_a");
    expect(parseProcessSearchParam(["proc_a", "proc_b"])).toBe("proc_a");
    expect(parseProcessSearchParam("")).toBeNull();
  });
});

describe("isGovernanceLinkedPolicy", () => {
  it("returns true when policy id is in linked set", () => {
    expect(
      isGovernanceLinkedPolicy(["pol_a", "pol_b"], "pol_a"),
    ).toBe(true);
  });

  it("returns false when not linked or empty", () => {
    expect(isGovernanceLinkedPolicy(["pol_a"], "pol_x")).toBe(false);
    expect(isGovernanceLinkedPolicy([], "pol_a")).toBe(false);
    expect(isGovernanceLinkedPolicy(["pol_a"], "")).toBe(false);
  });
});
