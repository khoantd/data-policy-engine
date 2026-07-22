"use client";

import { useCallback, useId, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { YamlCodeEditorSkeleton } from "@/components/yaml-code-editor-skeleton";
import { cn } from "@/lib/utils";

const THEME_NAME = "drpe-light";

function defineDrpeTheme(monaco: Parameters<OnMount>[1]) {
  monaco.editor.defineTheme(THEME_NAME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "64748B", fontStyle: "italic" },
      { token: "string", foreground: "1E40AF" },
      { token: "number", foreground: "B45309" },
      { token: "keyword", foreground: "1E3A8A", fontStyle: "bold" },
      { token: "type", foreground: "3B82F6" },
    ],
    colors: {
      "editor.background": "#FFFFFF",
      "editor.foreground": "#1E3A8A",
      "editor.lineHighlightBackground": "#F8FAFC",
      "editor.selectionBackground": "#DBEAFE",
      "editorCursor.foreground": "#D97706",
      "editorLineNumber.foreground": "#94A3B8",
      "editorLineNumber.activeForeground": "#1E40AF",
      "editorIndentGuide.background": "#E9EEF6",
      "editorIndentGuide.activeBackground": "#DBEAFE",
      "editorWidget.background": "#FFFFFF",
      "editorWidget.border": "#DBEAFE",
      "focusBorder": "#1E40AF",
    },
  });
}

export function YamlCodeEditor({
  value,
  onChange,
  dirty = false,
  id,
  label = "Policy YAML",
  className,
  height = "22rem",
}: {
  value: string;
  onChange: (value: string) => void;
  dirty?: boolean;
  id?: string;
  label?: string;
  className?: string;
  height?: string;
}) {
  const reactId = useId();
  const editorId = id ?? `yaml-editor-${reactId}`;
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const lineCount = value.length === 0 ? 1 : value.split("\n").length;

  const handleMount: OnMount = useCallback((editor, monaco) => {
    defineDrpeTheme(monaco);
    monaco.editor.setTheme(THEME_NAME);
    editor.updateOptions({
      fontFamily: "var(--font-mono), ui-monospace, monospace",
      fontSize: 13,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      tabSize: 2,
      automaticLayout: true,
      renderLineHighlight: "line",
      padding: { top: 8, bottom: 8 },
      accessibilitySupport: "on",
    });

    const syncCursor = () => {
      const pos = editor.getPosition();
      if (pos) setCursor({ line: pos.lineNumber, column: pos.column });
    };
    syncCursor();
    editor.onDidChangeCursorPosition(syncCursor);
  }, []);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={editorId}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div
        id={editorId}
        role="group"
        aria-label={label}
        className={cn(
          "overflow-hidden rounded-md border border-border bg-surface transition-shadow duration-200",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        )}
      >
        <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/50 px-3 text-xs">
          <span className="rounded bg-surface px-1.5 py-0.5 font-mono font-medium text-primary ring-1 ring-border">
            YAML
          </span>
          <span className="font-mono text-muted-fg" aria-live="polite">
            Ln {cursor.line}, Col {cursor.column}
          </span>
          <span className="hidden font-mono text-muted-fg sm:inline">
            · {lineCount} line{lineCount === 1 ? "" : "s"}
          </span>
          {dirty ? (
            <span
              className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 font-medium text-accent"
              role="status"
            >
              Unsaved
            </span>
          ) : (
            <span className="ml-auto font-mono text-muted-fg">
              {value.length} chars
            </span>
          )}
        </div>
        <Editor
          language="yaml"
          theme={THEME_NAME}
          value={value}
          height={height}
          loading={<YamlCodeEditorSkeleton className="border-0" />}
          onChange={(next) => onChange(next ?? "")}
          onMount={handleMount}
          options={{
            ariaLabel: label,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: 13,
            lineHeight: 20,
            padding: { top: 8, bottom: 8 },
            accessibilitySupport: "on",
          }}
        />
      </div>
    </div>
  );
}
