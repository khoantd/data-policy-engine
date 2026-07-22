import { z } from "zod";
import {
  POLICY_KINDS,
  POLICY_SUGGEST_MODES,
} from "@/lib/ai/policy-suggest-prompt";
import {
  CLASSIFICATION_ENTITY_CATEGORIES,
  CLASSIFICATION_JURISDICTIONS,
} from "@/lib/ai/classification-skill-context";
import {
  RETENTION_INDUSTRIES,
  RETENTION_JURISDICTIONS,
} from "@/lib/ai/retention-skill-context";

export const MAX_DESCRIPTION_CHARS = 4_000;
export const MAX_YAML_CHARS = 40_000;

export const policySuggestBodySchema = z
  .object({
    policyKind: z.enum(POLICY_KINDS).default("retention"),
    mode: z.enum(POLICY_SUGGEST_MODES),
    description: z.string().max(MAX_DESCRIPTION_CHARS).default(""),
    yaml: z.string().max(MAX_YAML_CHARS).optional(),
    jurisdiction: z
      .enum([...RETENTION_JURISDICTIONS, ...CLASSIFICATION_JURISDICTIONS])
      .optional(),
    industry: z.enum(RETENTION_INDUSTRIES).optional(),
    entityCategory: z.enum(CLASSIFICATION_ENTITY_CATEGORIES).optional(),
    webSearch: z.boolean().default(true),
  })
  .superRefine((val, ctx) => {
    const desc = val.description.trim();
    const yaml = val.yaml?.trim() ?? "";
    if (val.mode === "generate" && !desc) {
      ctx.addIssue({
        code: "custom",
        message: "Description is required for Generate",
        path: ["description"],
      });
    }
    if (
      (val.mode === "polish" ||
        val.mode === "enhance" ||
        val.mode === "expand") &&
      !yaml
    ) {
      ctx.addIssue({
        code: "custom",
        message: `Current YAML is required for ${val.mode}`,
        path: ["yaml"],
      });
    }
    if (val.mode === "expand" && !desc) {
      ctx.addIssue({
        code: "custom",
        message: "Description is required for Expand",
        path: ["description"],
      });
    }
  });

export type PolicySuggestBody = z.infer<typeof policySuggestBodySchema>;
