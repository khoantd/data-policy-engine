# ROS Policy — TypeScript API client

[![npm version](https://img.shields.io/npm/v/@khoadue/drpe-api-client.svg)](https://www.npmjs.com/package/@khoadue/drpe-api-client)

Generated OpenAPI (`typescript-fetch`) client for the ROS Policy `/api/v1` REST API.

Package name: **`@khoadue/drpe-api-client`**

## Install

```bash
npm install @khoadue/drpe-api-client
```

## Usage

```ts
import {
  Configuration,
  PoliciesApi,
  EvaluateApi,
  ClassifyApi,
} from "@khoadue/drpe-api-client";

const config = new Configuration({
  basePath: process.env.DRPE_API_URL ?? "http://localhost:8000",
  // When the server has DRPE_API_KEY set:
  accessToken: process.env.DRPE_API_KEY,
});

const policies = new PoliciesApi(config);
const list = await policies.listPoliciesApiV1PoliciesGet();

const evaluate = new EvaluateApi(config);
const result = await evaluate.evaluateOneApiV1EvaluatePost({
  evaluationRequest: {
    data_type: "customer_profile",
    record_id: "cust_123",
    metadata: { status: "inactive" },
  },
});

const classify = new ClassifyApi(config);
const scan = await classify.classifyOneApiV1ClassifyPost({
  classificationRequest: {
    data_type: "customer_profile",
    record_id: "cust_123",
    metadata: { email: "user@example.com" },
  },
});
```

## Auth

Send `Authorization: Bearer <key>` via `Configuration.accessToken` when the API has `DRPE_API_KEY` set.

## Publish (maintainers)

npm often returns a misleading **E404** on first publish when the auth token is invalid. Fix login first:

```bash
npm login
npm whoami    # must print khoadue
cd clients/typescript
npm run publish:local
```

Requires `--access public` (already in `publishConfig` / `publish:local`) for scoped packages.

## Regenerate (maintainers)

From the monorepo root (Python venv active for schema export):

```bash
npm run openapi
./scripts/build-ts-client.sh
cd clients/typescript && npm run publish:local
```

`package.json`, this README, and tsconfig files are preserved across regen (see `.openapi-generator-ignore`).

## APIs included

Audit, Classify, DSAR, Enforce, Evaluate, Grace Holds, Health, Jurisdictions, Policies, Privacy, Processes, Systems, Webhooks.

## Release notes

### 0.1.0 — 2026-07-25

- Initial public release of the ROS Policy TypeScript OpenAPI client (`typescript-fetch`)
- Published as scoped package `@khoadue/drpe-api-client` (required for reliable first publish)
- Full `/api/v1` coverage: policies, evaluate, classify, DSAR, enforce, grace holds, systems, processes, webhooks, audit, privacy, health, jurisdictions
- Dual CJS + ESM builds with TypeScript typings
