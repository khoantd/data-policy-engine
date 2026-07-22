"use client";

import dynamic from "next/dynamic";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { savePolicyAction, validatePolicyAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/layout";
import { YamlCodeEditorSkeleton } from "@/components/yaml-code-editor-skeleton";

const YamlCodeEditor = dynamic(
  () =>
    import("@/components/yaml-code-editor").then((m) => m.YamlCodeEditor),
  {
    ssr: false,
    loading: () => <YamlCodeEditorSkeleton />,
  },
);

export function PolicyYamlEditor({
  policyId,
  initialYaml,
}: {
  policyId: string;
  initialYaml: string;
}) {
  const boundSave = savePolicyAction.bind(null, policyId);
  const [saveState, saveAction, saving] = useActionState(boundSave, null);
  const [valState, valAction, validating] = useActionState(
    validatePolicyAction,
    null,
  );
  const [yaml, setYaml] = useState(initialYaml);
  const formRef = useRef<HTMLFormElement>(null);
  const dirty = yaml !== initialYaml;

  useEffect(() => {
    setYaml(initialYaml);
  }, [initialYaml]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col gap-4">
      <form
        ref={formRef}
        action={saveAction}
        className="flex flex-col gap-3"
      >
        <input type="hidden" name="yaml" value={yaml} />
        <YamlCodeEditor
          value={yaml}
          onChange={setYaml}
          dirty={dirty}
          label="Policy YAML"
        />
        {(saveState?.error || valState?.error) && (
          <ErrorAlert message={(saveState?.error || valState?.error)!} />
        )}
        {(saveState?.ok || valState?.ok) && (
          <p className="text-sm text-success" role="status">
            {saveState?.message || valState?.message}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Validate & save"}
          </Button>
          <Button
            type="submit"
            formAction={valAction}
            variant="secondary"
            disabled={validating}
          >
            {validating ? "Checking…" : "Validate only"}
          </Button>
          <span className="text-xs text-muted-fg">
            <kbd className="rounded border border-border bg-muted px-1 font-mono text-[0.7rem]">
              ⌘/Ctrl
            </kbd>
            +
            <kbd className="rounded border border-border bg-muted px-1 font-mono text-[0.7rem]">
              S
            </kbd>{" "}
            to save
          </span>
        </div>
      </form>
    </div>
  );
}
