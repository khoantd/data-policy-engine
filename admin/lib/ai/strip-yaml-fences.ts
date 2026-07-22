/**
 * Strip markdown code fences that models often wrap around YAML.
 */
export function stripYamlFences(text: string): string {
  let out = text.trim();
  const fenced = /^```(?:ya?ml)?\s*\n?([\s\S]*?)\n?```\s*$/i.exec(out);
  if (fenced) {
    return fenced[1].replace(/\s+$/, "");
  }
  out = out.replace(/^```(?:ya?ml)?\s*\n?/i, "");
  out = out.replace(/\n?```\s*$/i, "");
  return out.replace(/\s+$/, "");
}
