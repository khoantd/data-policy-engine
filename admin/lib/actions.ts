"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError, PolicyStatus } from "@/lib/types";

function errMsg(err: unknown): string {
  if (err instanceof DrpeApiError) {
    return typeof err.detail === "string"
      ? err.detail
      : JSON.stringify(err.detail);
  }
  return err instanceof Error ? err.message : "Unknown error";
}

function rethrowRedirect(err: unknown): void {
  if (
    err &&
    typeof err === "object" &&
    "digest" in err &&
    typeof (err as { digest?: string }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  ) {
    throw err;
  }
}

export async function importPolicyAction(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const yaml = String(formData.get("yaml") || "");
  if (!yaml.trim()) return { error: "YAML is required" };
  try {
    const res = await drpe.importYaml(yaml);
    revalidatePath("/policies");
    if (res.imported[0]) {
      redirect(`/policies/${encodeURIComponent(res.imported[0])}`);
    }
    return { ok: true };
  } catch (err) {
    rethrowRedirect(err);
    return { error: errMsg(err) };
  }
}

export async function validatePolicyAction(
  _prev: { error?: string; ok?: boolean; message?: string } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; message?: string }> {
  const yaml = String(formData.get("yaml") || "");
  try {
    const res = await drpe.validateYaml(yaml);
    if (!res.valid) {
      return { error: (res.errors || ["Invalid policy"]).join("; ") };
    }
    return { ok: true, message: `Valid: ${res.policy?.id} v${res.policy?.version}` };
  } catch (err) {
    return { error: errMsg(err) };
  }
}

export async function savePolicyAction(
  policyId: string,
  _prev: { error?: string; ok?: boolean; message?: string } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; message?: string }> {
  const yaml = String(formData.get("yaml") || "");
  try {
    const validated = await drpe.validateYaml(yaml);
    if (!validated.valid) {
      return { error: (validated.errors || ["Invalid policy"]).join("; ") };
    }
    const saved = await drpe.updatePolicyYaml(policyId, yaml);
    revalidatePath(`/policies/${policyId}`);
    revalidatePath("/policies");
    return { ok: true, message: `Saved ${saved.id} as v${saved.version}` };
  } catch (err) {
    return { error: errMsg(err) };
  }
}

export async function changePolicyStatusAction(
  policyId: string,
  status: PolicyStatus,
): Promise<{ error?: string; ok?: boolean }> {
  try {
    await drpe.changePolicyStatus(policyId, status);
    revalidatePath(`/policies/${policyId}`);
    revalidatePath("/policies");
    return { ok: true };
  } catch (err) {
    return { error: errMsg(err) };
  }
}

export async function deprecatePolicyAction(policyId: string): Promise<void> {
  await changePolicyStatusAction(policyId, "deprecated");
}

export async function activateVersionAction(
  policyId: string,
  version: number,
): Promise<{ error?: string }> {
  try {
    await drpe.activateVersion(policyId, version);
    revalidatePath(`/policies/${policyId}`);
    return {};
  } catch (err) {
    return { error: errMsg(err) };
  }
}

export async function createDsarAction(
  kind: "access" | "erasure",
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const subject_id = String(formData.get("subject_id") || "").trim();
  const policy_id = String(formData.get("policy_id") || "").trim();
  if (!subject_id || !policy_id) {
    return { error: "subject_id and policy_id are required" };
  }
  try {
    const body = { subject_id, policy_id };
    const req =
      kind === "access"
        ? await drpe.submitAccess(body)
        : await drpe.submitErasure(body);
    redirect(`/dsar/${encodeURIComponent(req.id)}`);
  } catch (err) {
    rethrowRedirect(err);
    return { error: errMsg(err) };
  }
}

export async function createWebhookAction(
  _prev: { error?: string; secret?: string } | null,
  formData: FormData,
): Promise<{ error?: string; secret?: string }> {
  const url = String(formData.get("url") || "").trim();
  const eventsRaw = String(formData.get("events") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const secret = String(formData.get("secret") || "").trim();
  const events = eventsRaw
    .split(/[,\s]+/)
    .map((e) => e.trim())
    .filter(Boolean);
  if (!url || events.length === 0) {
    return { error: "URL and at least one event are required" };
  }
  try {
    const created = await drpe.createWebhook({
      url,
      events,
      description: description || undefined,
      secret: secret || undefined,
    });
    revalidatePath("/webhooks");
    return { secret: created.secret };
  } catch (err) {
    return { error: errMsg(err) };
  }
}

export async function deleteWebhookAction(id: string): Promise<{ error?: string }> {
  try {
    await drpe.deleteWebhook(id);
    revalidatePath("/webhooks");
    return {};
  } catch (err) {
    return { error: errMsg(err) };
  }
}

export async function toggleWebhookAction(
  id: string,
  active: boolean,
): Promise<{ error?: string }> {
  try {
    await drpe.updateWebhook(id, { active });
    revalidatePath("/webhooks");
    return {};
  } catch (err) {
    return { error: errMsg(err) };
  }
}

export async function triggerEnforceAction(
  _prev: { error?: string; jobId?: string } | null,
  formData: FormData,
): Promise<{ error?: string; jobId?: string }> {
  const policy_id = String(formData.get("policy_id") || "").trim();
  try {
    const res = await drpe.triggerEnforce({
      policy_id: policy_id || undefined,
    });
    revalidatePath("/enforce");
    redirect(`/enforce/${encodeURIComponent(res.job_id)}`);
  } catch (err) {
    rethrowRedirect(err);
    return { error: errMsg(err) };
  }
}

export type EvaluateActionState = {
  error?: string;
  result?: Awaited<ReturnType<typeof drpe.evaluateOne>>;
  results?: Awaited<ReturnType<typeof drpe.evaluateBatch>>;
};

function parseJsonObject(
  raw: string,
  label: string,
): { value?: Record<string, unknown>; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { value: {} };
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return { error: `${label} must be a JSON object` };
    }
    return { value: parsed as Record<string, unknown> };
  } catch {
    return { error: `${label} is not valid JSON` };
  }
}

export async function evaluateAction(
  _prev: EvaluateActionState | null,
  formData: FormData,
): Promise<EvaluateActionState> {
  const mode = String(formData.get("mode") || "single").trim();
  const dryRun = formData.get("dry_run") === "on";

  try {
    if (mode === "batch") {
      const raw = String(formData.get("batch_records") || "").trim();
      if (!raw) return { error: "Batch records JSON is required" };
      let records: unknown;
      try {
        records = JSON.parse(raw);
      } catch {
        return { error: "Batch records is not valid JSON" };
      }
      if (!Array.isArray(records) || records.length === 0) {
        return { error: "Batch records must be a non-empty JSON array" };
      }
      if (records.length > 1000) {
        return { error: "Batch limit is 1000 records" };
      }
      for (const rec of records) {
        if (
          !rec ||
          typeof rec !== "object" ||
          typeof (rec as { data_type?: unknown }).data_type !== "string" ||
          typeof (rec as { record_id?: unknown }).record_id !== "string"
        ) {
          return {
            error:
              "Each batch record needs data_type and record_id (snake_case)",
          };
        }
      }
      // Batch endpoint has no dry-run twin; use live evaluate/batch only.
      const results = await drpe.evaluateBatch(
        records as Parameters<typeof drpe.evaluateBatch>[0],
      );
      return { results };
    }

    const data_type = String(formData.get("data_type") || "").trim();
    const record_id = String(formData.get("record_id") || "").trim();
    if (!data_type) return { error: "Data type is required" };
    if (!record_id) return { error: "Record ID is required" };

    const meta = parseJsonObject(
      String(formData.get("metadata") || ""),
      "Metadata",
    );
    if (meta.error) return { error: meta.error };
    const ctx = parseJsonObject(
      String(formData.get("context") || ""),
      "Context",
    );
    if (ctx.error) return { error: ctx.error };

    const source = String(formData.get("source") || "").trim() || undefined;
    const jurisdiction =
      String(formData.get("jurisdiction") || "").trim() || undefined;
    const contextRaw = String(formData.get("context") || "").trim();

    const body = {
      data_type,
      record_id,
      metadata: meta.value ?? {},
      source,
      jurisdiction,
      context: contextRaw ? (ctx.value ?? null) : null,
    };

    const result = dryRun
      ? await drpe.evaluateDryRun(body)
      : await drpe.evaluateOne(body);
    return { result };
  } catch (err) {
    return { error: errMsg(err) };
  }
}

export type ClassifyActionState = {
  error?: string;
  result?: import("@/lib/types").ClassificationResponse;
  submittedMetadata?: Record<string, unknown>;
};

export async function classifyAction(
  _prev: ClassifyActionState | null,
  formData: FormData,
): Promise<ClassifyActionState> {
  const policy_id = String(formData.get("policy_id") || "").trim() || undefined;
  const data_type = String(formData.get("data_type") || "").trim();
  const record_id = String(formData.get("record_id") || "").trim();
  if (!data_type) return { error: "Data type is required" };
  if (!record_id) return { error: "Record ID is required" };

  const meta = parseJsonObject(
    String(formData.get("metadata") || ""),
    "Metadata",
  );
  if (meta.error) return { error: meta.error };

  const jurisdiction =
    String(formData.get("jurisdiction") || "").trim() || undefined;
  const source = String(formData.get("source") || "").trim() || undefined;

  try {
    const result = await drpe.classifyDryRun({
      data_type,
      record_id,
      metadata: meta.value ?? {},
      source,
      jurisdiction,
      policy_id,
    });
    return {
      result,
      submittedMetadata: meta.value ?? {},
    };
  } catch (err) {
    return { error: errMsg(err) };
  }
}
