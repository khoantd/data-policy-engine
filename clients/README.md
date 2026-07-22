# Generated API clients

Standalone HTTP clients generated from [`../openapi/openapi.json`](../openapi/openapi.json) for the DRPE `/api/v1` REST API.

| Language | Path | Generator |
|----------|------|-----------|
| TypeScript | [`typescript/`](typescript/) | `typescript-fetch` (`drpe-api-client`) |
| Go | [`go/`](go/) | `go` (`github.com/drpe/drpe/clients/go`) |
| Java | [`java/`](java/) | `java` / okhttp-gson (`com.drpe:drpe-api-client`) |

The Admin UI keeps a hand-written BFF fetch wrapper (`admin/lib/drpe-client.ts`) but regenerates TypeScript **types** from the same schema:

```bash
npm run openapi:generate:admin   # → admin/lib/generated/schema.d.ts
# included in `npm run openapi`
```

## Regenerate

From the repo root (Python venv activated for export):

```bash
npm install          # once — installs openapi-generator-cli
npm run openapi      # export schema + regenerate all clients
```

Or:

```bash
./scripts/generate_clients.sh
```

Individual steps:

```bash
npm run openapi:export              # → openapi/openapi.json
npm run openapi:generate            # TS + Go + Java
npm run openapi:generate:typescript
npm run openapi:generate:go
npm run openapi:generate:java
npm run openapi:generate:admin     # Admin openapi-typescript types
```

Export uses an in-memory FastAPI app (ignores local `DATABASE_URL` / `REDIS_URL`).

## Auth

When the server has `DRPE_API_KEY` set, send `Authorization: Bearer <key>`.

### TypeScript

```ts
import { Configuration, PoliciesApi } from "drpe-api-client";

const config = new Configuration({
  basePath: "http://localhost:8000",
  accessToken: process.env.DRPE_API_KEY,
});
const policies = new PoliciesApi(config);
const list = await policies.listPoliciesApiV1PoliciesGet();
```

### Go

```go
import (
  "context"
  drpe "github.com/drpe/drpe/clients/go"
)

cfg := drpe.NewConfiguration()
cfg.Servers = drpe.ServerConfigurations{{URL: "http://localhost:8000"}}
cfg.AddDefaultHeader("Authorization", "Bearer "+apiKey)
client := drpe.NewAPIClient(cfg)
list, _, err := client.PoliciesAPI.ListPoliciesApiV1PoliciesGet(context.Background()).Execute()
```

### Java

```java
import com.drpe.client.ApiClient;
import com.drpe.client.Configuration;
import com.drpe.client.api.PoliciesApi;
import com.drpe.client.auth.HttpBearerAuth;

ApiClient client = Configuration.getDefaultApiClient();
client.setBasePath("http://localhost:8000");
HttpBearerAuth bearer = (HttpBearerAuth) client.getAuthentication("BearerAuth");
bearer.setBearerToken(apiKey);
PoliciesApi policies = new PoliciesApi(client);
policies.listPoliciesApiV1PoliciesGet(null);
```

See each client's generated `README.md` for full API coverage.
