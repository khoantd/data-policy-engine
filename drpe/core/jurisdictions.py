"""Jurisdiction registry and applicability checks."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class JurisdictionInfo:
    code: str
    name: str
    description: str
    default_max_retention_days: int | None = None


JURISDICTIONS: dict[str, JurisdictionInfo] = {
    "EU_GDPR": JurisdictionInfo(
        code="EU_GDPR",
        name="EU GDPR",
        description="European Union General Data Protection Regulation",
        default_max_retention_days=3650,
    ),
    "VN_PDPD": JurisdictionInfo(
        code="VN_PDPD",
        name="Vietnam PDPD",
        description="Vietnam Personal Data Protection Decree",
        default_max_retention_days=3650,
    ),
    "GLOBAL": JurisdictionInfo(
        code="GLOBAL",
        name="Global / Default",
        description="Applies globally when no specific jurisdiction is required",
        default_max_retention_days=None,
    ),
}


def list_jurisdictions() -> list[JurisdictionInfo]:
    return list(JURISDICTIONS.values())


def get_jurisdiction(code: str) -> JurisdictionInfo | None:
    return JURISDICTIONS.get(code)


def jurisdiction_applies(policy_jurisdiction: str, request_jurisdiction: str | None) -> bool:
    """Return True if a policy should be considered for the request jurisdiction.

    Rules:
    - Policy with GLOBAL always applies.
    - If request has no jurisdiction, only GLOBAL policies apply (or all if we
      treat missing as unrestricted — we apply all for embedded flexibility).
    - Otherwise policy jurisdiction must equal request jurisdiction.
    """
    if policy_jurisdiction == "GLOBAL":
        return True
    if request_jurisdiction is None:
        return True
    return policy_jurisdiction == request_jurisdiction
