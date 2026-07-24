import { describe, expect, it } from "vitest";
import {
  parseReferenceSources,
  policyForYamlDump,
} from "@/lib/reference-sources";

const valid = {
  id: 1,
  title: "GDPR Art. 5",
  url: "https://gdpr.eu/article-5-how-to-process-personal-data/",
  snippet: "Principles relating to processing of personal data.",
  domain: "gdpr.eu",
};

describe("parseReferenceSources", () => {
  it("returns empty for missing or blank input", () => {
    expect(parseReferenceSources(null)).toEqual([]);
    expect(parseReferenceSources("")).toEqual([]);
    expect(parseReferenceSources(undefined)).toEqual([]);
  });

  it("parses a JSON array of sources", () => {
    expect(parseReferenceSources(JSON.stringify([valid]))).toEqual([valid]);
  });

  it("drops non-https urls and malformed entries", () => {
    const raw = JSON.stringify([
      valid,
      { ...valid, id: 2, url: "http://insecure.example" },
      { title: "no id", url: "https://ok.example" },
      null,
      "skip",
    ]);
    expect(parseReferenceSources(raw)).toEqual([valid]);
  });

  it("returns empty on invalid JSON", () => {
    expect(parseReferenceSources("{not-json")).toEqual([]);
  });
});

describe("policyForYamlDump", () => {
  it("strips reference_sources while keeping other fields", () => {
    const policy = {
      id: "pol_x",
      name: "X",
      reference_sources: [valid],
      rules: [{ id: "r1" }],
    };
    expect(policyForYamlDump(policy)).toEqual({
      id: "pol_x",
      name: "X",
      rules: [{ id: "r1" }],
    });
  });
});
