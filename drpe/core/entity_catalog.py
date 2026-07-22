"""Jurisdiction-specific entity catalog seeds for classification policies."""

from __future__ import annotations

from drpe.models.classification_policy import ClassificationEntity, EntityDetection
from drpe.models.enums import DataClassification, Sensitivity

CATALOGS: dict[str, list[ClassificationEntity]] = {
    "EU_GDPR": [
        ClassificationEntity(
            id="gdpr_email",
            label="Email address",
            classification=DataClassification.PII,
            sensitivity=Sensitivity.MEDIUM,
            regulatory_refs=["GDPR Art. 4(1)"],
            detection=EntityDetection(
                field_names=["email", "contact_email", "e_mail"],
                ner_types=["EMAIL"],
            ),
        ),
        ClassificationEntity(
            id="gdpr_phone",
            label="Phone number",
            classification=DataClassification.PII,
            sensitivity=Sensitivity.MEDIUM,
            regulatory_refs=["GDPR Art. 4(1)"],
            detection=EntityDetection(
                field_names=["phone", "mobile", "telephone"],
                ner_types=["PHONE"],
            ),
        ),
        ClassificationEntity(
            id="gdpr_national_id",
            label="National identifier",
            classification=DataClassification.SPII,
            sensitivity=Sensitivity.CRITICAL,
            regulatory_refs=["GDPR Art. 9 (verify lawful basis)"],
            detection=EntityDetection(
                field_names=["ssn", "national_id", "passport", "tax_id"],
            ),
        ),
        ClassificationEntity(
            id="gdpr_health",
            label="Health data",
            classification=DataClassification.SPII,
            sensitivity=Sensitivity.CRITICAL,
            regulatory_refs=["GDPR Art. 9"],
            detection=EntityDetection(
                field_names=["diagnosis", "medical_record", "health_status"],
            ),
        ),
    ],
    "VN_PDPD": [
        ClassificationEntity(
            id="pdpd_cmnd",
            label="CMND/CCCD",
            classification=DataClassification.SPII,
            sensitivity=Sensitivity.CRITICAL,
            regulatory_refs=["Nghị định 13/2023/NĐ-CP"],
            detection=EntityDetection(field_names=["cmnd", "cccd", "national_id"]),
        ),
        ClassificationEntity(
            id="pdpd_phone",
            label="Phone number",
            classification=DataClassification.PII,
            sensitivity=Sensitivity.MEDIUM,
            regulatory_refs=["Nghị định 13/2023/NĐ-CP"],
            detection=EntityDetection(field_names=["phone", "mobile", "sdt"]),
        ),
    ],
    "SG_PDPA": [
        ClassificationEntity(
            id="pdpa_nric",
            label="NRIC/FIN",
            classification=DataClassification.SPII,
            sensitivity=Sensitivity.CRITICAL,
            regulatory_refs=["PDPA personal data"],
            detection=EntityDetection(field_names=["nric", "fin", "national_id"]),
        ),
    ],
    "GLOBAL": [
        ClassificationEntity(
            id="global_email",
            label="Email address",
            classification=DataClassification.PII,
            sensitivity=Sensitivity.MEDIUM,
            regulatory_refs=["Cross-jurisdiction PII"],
            detection=EntityDetection(
                field_names=["email", "contact_email"],
                ner_types=["EMAIL"],
            ),
        ),
    ],
}


def resolve_catalog_entities(
    catalog_ref: str | None,
    jurisdiction: str,
) -> list[ClassificationEntity]:
    if catalog_ref and catalog_ref in CATALOGS:
        return CATALOGS[catalog_ref]
    return CATALOGS.get(jurisdiction, CATALOGS.get("GLOBAL", []))
