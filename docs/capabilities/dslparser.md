# DSL Parser

## Purpose
The DSL Parser translates a policy expressed in a human‑readable YAML domain‑specific language into a strongly‑typed `Pydantic` model that the ROS Policy engine consumes. It acts as the single source of truth for policy syntax validation and structural normalization before other core components such as the Evaluator, Classifier, or Policy Diff operate on the resulting data.

## Responsibilities
| Responsibility | Description |
|----------------|-------------|
| **YAML ingestion** | Accept raw YAML input from strings, files, or streams. |
| **Parsing & normalization** | Use `yaml.safe_load` to convert YAML into intermediate Python data structures, then apply custom normalizers (e.g., resolving anchors or aliases). |
| **Pydantic validation** | Instantiate the corresponding `Pydantic` policy model (`drpe.policy.PolicyModel`) and enforce field constraints, nested schemas, and version semantics. |
| **Error reporting** | Capture and surface parse or validation errors with context (line numbers, offending keys) for UI or CLI feedback. |
| **Caching & memoization** | Optional in‑memory caching of parsed models to avoid redundant work in repeated evaluation cycles. |
| **Versioning support** | Preserve the policy’s semantic version and maintain compatibility with older policy shapes through model aliasing or migration hooks. |

## Interfaces and Dependencies

| Interface | Type | Details |
|-----------|------|---------|
| `parse_policy(yaml_source: Union[str, Path]) -> drpe.policy.PolicyModel` | Function | Primary public API. Accepts a file path or YAML string. Returns a fully‑validated Pydantic model. |
| `load_policy_file(file_path: Path) -> drpe.policy.PolicyModel` | Function | Convenience wrapper that reads a file and delegates to `parse_policy`. |
| `parse_policy_stream(stream: TextIO) -> drpe.policy.PolicyModel` | Function | For streaming input (e.g., from HTTP request). |
| `PolicyParser` (class) | Optional wrapper | Provides stateful parsing (e.g., caching) when repeatedly parsing the same source. |

**Dependencies**

- `yaml` (PyYAML) – safe YAML loader.
- `pydantic` – data validation and type enforcement.
- `drpe.policy.models` – Pydantic definitions of policy schemas.
- `drpe.policy.exceptions` – custom exception types for parse errors.
- Standard library: `pathlib`, `io`, `typing`.

## Constraints & Notes

- **Transport‑agnostic**: The parser is purely functional; it does not perform I/O beyond reading the YAML source. All persistence is handled by the `PolicyStore` port elsewhere in the engine.
- **Thread‑safe**: The component contains no mutable global state; any caching is per‑instance and guarded with thread‑local data or locks if enabled.
- **Extensibility**: Adding new policy attributes requires updating the Pydantic model in `drpe.policy.models`; the parser itself remains unchanged.
- **Error handling**: Validation errors propagate as `drpe.policy.exceptions.PolicyParseError`, ensuring callers can distinguish parsing from runtime logic errors.
- **Testing**: Unit tests in `tests/dsl/test_parser.py` cover happy‑path parsing, schema violations, missing fields, and edge cases such as duplicate keys.
- **Performance**: Parsing is expected to be a lightweight operation relative to evaluation or enforcement. If large policy sets are used, the optional caching mechanism can reduce repeated parse costs.

---

**Use Cases**

1. **Policy upload via Admin UI** – The UI posts a YAML string; the backend uses `parse_policy` to validate before persisting.
2. **SDK ingestion** – A Python client passes a YAML string to the SDK; the SDK internally calls the parser to construct the in‑memory policy model.
3. **Policy diff** – The `Policy Diff` component loads two YAML files, parses them, and compares the resulting Pydantic models for structural changes.
