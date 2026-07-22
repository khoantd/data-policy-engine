"""Tests for YAML DSL parser and policy models."""

from pathlib import Path

import pytest

from drpe.dsl import PolicyParseError, parse_file, parse_yaml
from drpe.models.enums import Action, Operator, PolicyStatus

FIXTURES = Path(__file__).resolve().parent / "fixtures"
CONFIG = Path(__file__).resolve().parents[1] / "config" / "gdpr_customer.yaml"


def test_parse_gdpr_fixture_from_config() -> None:
    policy = parse_file(CONFIG)
    assert policy.id == "pol_gdpr_customer"
    assert policy.status == PolicyStatus.ACTIVE
    assert policy.jurisdiction == "EU_GDPR"
    assert len(policy.rules) == 3
    assert policy.rules[0].action == Action.DELETE
    assert policy.rules[0].grace_period == "30d"
    legal = next(r for r in policy.rules if r.id == "rule_legal_hold")
    assert legal.priority == 1
    assert legal.condition.any is not None


def test_parse_yaml_string() -> None:
    yaml_text = """
policy:
  id: pol_simple
  name: Simple
  status: draft
  jurisdiction: GLOBAL
  data_classification: public
  scope:
    data_types: [logs]
  rules:
    - id: r1
      priority: 10
      condition:
        all:
          - field: age_days
            operator: gt
            value: 90
      action: delete
"""
    policy = parse_yaml(yaml_text)
    assert policy.id == "pol_simple"
    assert policy.rules[0].condition.all[0].operator == Operator.GT


def test_reject_unknown_operator() -> None:
    yaml_text = """
policy:
  id: pol_bad
  name: Bad
  jurisdiction: GLOBAL
  data_classification: public
  rules:
    - id: r1
      priority: 10
      condition:
        all:
          - field: x
            operator: weird_op
            value: 1
      action: delete
"""
    with pytest.raises(PolicyParseError) as exc:
        parse_yaml(yaml_text)
    assert "validation failed" in str(exc.value).lower() or exc.value.errors


def test_reject_missing_policy_id() -> None:
    yaml_text = """
policy:
  name: No Id
  jurisdiction: GLOBAL
  data_classification: public
  rules:
    - id: r1
      priority: 10
      condition:
        all:
          - field: x
            operator: eq
            value: 1
      action: retain
"""
    with pytest.raises(PolicyParseError):
        parse_yaml(yaml_text)


def test_reject_invalid_duration() -> None:
    yaml_text = """
policy:
  id: pol_bad_dur
  name: Bad Dur
  jurisdiction: GLOBAL
  data_classification: public
  rules:
    - id: r1
      priority: 10
      condition:
        all:
          - field: x
            operator: eq
            value: 1
      action: delete
      grace_period: "two weeks"
"""
    with pytest.raises(PolicyParseError):
        parse_yaml(yaml_text)


def test_reject_empty_yaml() -> None:
    with pytest.raises(PolicyParseError, match="empty"):
        parse_yaml("")


def test_parse_bare_policy_without_wrapper() -> None:
    yaml_text = """
id: pol_bare
name: Bare
jurisdiction: GLOBAL
data_classification: operational
rules:
  - id: r1
    priority: 5
    condition:
      all:
        - field: status
          operator: eq
          value: done
    action: archive
"""
    policy = parse_yaml(yaml_text)
    assert policy.id == "pol_bare"
