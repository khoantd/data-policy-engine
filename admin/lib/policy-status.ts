import { PolicyStatus } from "@/lib/types";

export type PolicyActionVariant = "primary" | "secondary" | "danger";

export type PolicyLifecycleAction = {
  id: string;
  label: string;
  targetStatus: PolicyStatus;
  description: string;
  confirmTitle: string;
  confirmBody: string;
  variant: PolicyActionVariant;
  requiresConfirm: true;
};

const ACTIONS: Record<PolicyStatus, PolicyLifecycleAction[]> = {
  draft: [
    {
      id: "publish",
      label: "Publish",
      targetStatus: "active",
      description: "Make this policy live for evaluation and enforcement.",
      confirmTitle: "Publish policy?",
      confirmBody:
        "This policy will become active and participate in evaluation and enforcement. Only active policies are applied at runtime.",
      variant: "primary",
      requiresConfirm: true,
    },
    {
      id: "deprecate",
      label: "Deprecate",
      targetStatus: "deprecated",
      description: "Retire this draft without publishing it.",
      confirmTitle: "Deprecate policy?",
      confirmBody:
        "This policy will be marked deprecated and will not be evaluated. You can reactivate or restore it later.",
      variant: "danger",
      requiresConfirm: true,
    },
    {
      id: "archive",
      label: "Archive",
      targetStatus: "archived",
      description: "Move this draft to long-term storage.",
      confirmTitle: "Archive policy?",
      confirmBody:
        "This policy will be archived and will not be evaluated until reactivated.",
      variant: "secondary",
      requiresConfirm: true,
    },
  ],
  active: [
    {
      id: "restore-draft",
      label: "Restore to draft",
      targetStatus: "draft",
      description: "Unpublish and return to editable draft state.",
      confirmTitle: "Restore to draft?",
      confirmBody:
        "This policy will no longer be evaluated until published again. Definition content is unchanged.",
      variant: "secondary",
      requiresConfirm: true,
    },
    {
      id: "deprecate",
      label: "Deprecate",
      targetStatus: "deprecated",
      description: "Soft-retire this active policy.",
      confirmTitle: "Deprecate policy?",
      confirmBody:
        "This policy will stop participating in evaluation immediately. You can reactivate it later.",
      variant: "danger",
      requiresConfirm: true,
    },
    {
      id: "archive",
      label: "Archive",
      targetStatus: "archived",
      description: "Move this policy to long-term storage.",
      confirmTitle: "Archive policy?",
      confirmBody:
        "This policy will be archived and will not be evaluated until reactivated.",
      variant: "secondary",
      requiresConfirm: true,
    },
  ],
  deprecated: [
    {
      id: "reactivate",
      label: "Reactivate",
      targetStatus: "active",
      description: "Return this policy to live evaluation.",
      confirmTitle: "Reactivate policy?",
      confirmBody:
        "This policy will become active again and participate in evaluation and enforcement.",
      variant: "primary",
      requiresConfirm: true,
    },
    {
      id: "restore-draft",
      label: "Restore to draft",
      targetStatus: "draft",
      description: "Move back to draft for further editing.",
      confirmTitle: "Restore to draft?",
      confirmBody:
        "This policy will be editable as a draft and will not be evaluated until published.",
      variant: "secondary",
      requiresConfirm: true,
    },
    {
      id: "archive",
      label: "Archive",
      targetStatus: "archived",
      description: "Move to long-term storage.",
      confirmTitle: "Archive policy?",
      confirmBody:
        "This policy will be archived and will not be evaluated until reactivated.",
      variant: "secondary",
      requiresConfirm: true,
    },
  ],
  archived: [
    {
      id: "reactivate",
      label: "Reactivate",
      targetStatus: "active",
      description: "Return this policy to live evaluation.",
      confirmTitle: "Reactivate policy?",
      confirmBody:
        "This policy will become active again and participate in evaluation and enforcement.",
      variant: "primary",
      requiresConfirm: true,
    },
    {
      id: "restore-draft",
      label: "Restore to draft",
      targetStatus: "draft",
      description: "Move back to draft for further editing.",
      confirmTitle: "Restore to draft?",
      confirmBody:
        "This policy will be editable as a draft and will not be evaluated until published.",
      variant: "secondary",
      requiresConfirm: true,
    },
  ],
};

export function getAvailablePolicyActions(
  currentStatus: PolicyStatus,
): PolicyLifecycleAction[] {
  return ACTIONS[currentStatus] ?? [];
}

export function statusChangeMessage(
  label: string,
  targetStatus: PolicyStatus,
): string {
  return `${label} complete — policy is now ${targetStatus.replace(/_/g, " ")}.`;
}
