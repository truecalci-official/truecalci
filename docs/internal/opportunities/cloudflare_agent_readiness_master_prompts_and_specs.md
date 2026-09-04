# Cloudflare AI Agent Readiness: Master Prompts, RFC Standards & Implementation Encyclopedia

> **Permanent Architectural Reference Document**  
> Preserving the complete Cloudflare Agent Readiness diagnostic specifications, RFC compliance rules, JSON schemas, and exact agent prompts for TrueCalci and all future micro-SaaS opportunities.

---

## 1. Quick Wins (Level 1 — 5/5)

### 1.1 Preferences for Bot Behavior (`robots.txt`)
* **Goal**: Declare access rules for web crawlers.
* **Requirements**:
  - Valid `robots.txt` served from origin root `/robots.txt`.
  - Declare canonical sitemap reference: `Sitemap: https://truecalci.com/sitemap.xml`.
* **TrueCalci Reference**: [`/robots.txt`](file:///c:/Calculator/robots.txt)

### 1.2 Give Agents a Website Map (`sitemap.xml`)
* **Goal**: Provide automated bots a clean index of all site URLs.
* **Requirements**:
  - Valid XML conforming to `http://www.sitemaps.org/schemas/sitemap/0.9`.
  - Include `<loc>`, `<lastmod>`, `<changefreq>`, and `<priority>`.
  - For multi-regional domains, include `xmlns:xhtml` alternate hreflang tags.
* **TrueCalci Reference**: [`/sitemap.xml`](file:///c:/Calculator/sitemap.xml)

### 1.3 Manage AI Bots (`AI Crawler Rules`)
* **Goal**: Explicitly declare permissions for frontier LLM search crawlers.
* **Requirements**:
  - Explicit `User-agent` blocks for:
    - `GPTBot` (OpenAI / ChatGPT)
    - `ChatGPT-User` (ChatGPT Search)
    - `ClaudeBot` & `Claude-Web` (Anthropic)
    - `PerplexityBot` (Perplexity AI)
    - `Google-Extended` (Gemini & Vertex AI)
    - `Applebot-Extended` (Apple Intelligence)
    - `Cohere-ai` (Cohere)

### 1.4 Declare Content Usage Rights (`Content Signals`)
* **Goal**: Tell AI systems whether they are authorized to index, search, and train on content.
* **Requirements**:
  - HTTP Header or HTML `<meta>` tag:
    ```html
    <meta name="content-signal" content="ai-train=yes, ai-input=yes, search=yes">
    <meta name="tdm-reservation" content="0">
    ```

### 1.5 Serve AI-Optimized Text Formats (`Markdown Negotiation`)
* **Goal**: Deliver clean, formatting-stripped text directly to agents instead of forcing them to parse complex HTML.
* **Requirements**:
  - Implement content negotiation where incoming requests containing `Accept: text/markdown` return a markdown representation (`llms.txt` or markdown page).
  - Include `Vary: Accept` response header.
* **Cloudflare Worker Pattern**:
  ```js
  if (request.headers.get("Accept")?.includes("text/markdown")) {
    const md = await env.ASSETS.fetch(new Request(new URL("/llms.txt", request.url)));
    return new Response(await md.text(), {
      headers: { "Content-Type": "text/markdown; charset=utf-8", "Vary": "Accept" }
    });
  }
  ```

---

## 2. Technical Groundwork (Level 2 — 3/3)

### 2.1 Expose a Directory of Web Services (`API Catalog` — RFC 9727)
* **Goal**: Publish a machine-readable API catalog for automated discovery.
* **Requirements**:
  - Endpoint: `/.well-known/api-catalog`
  - Content-Type: `application/linkset+json` with HTTP 200.
  - JSON format with `linkset` array containing `anchor`, `service-desc` (OpenAPI spec), `service-doc` (markdown docs), and `status` (health check).
* **TrueCalci Schema**:
  ```json
  {
    "linkset": [
      {
        "anchor": "https://truecalci.com/api/v1/",
        "service-desc": [{ "href": "https://truecalci.com/openapi.json", "type": "application/json" }],
        "service-doc": [{ "href": "https://truecalci.com/llms.txt", "type": "text/markdown" }],
        "status": [{ "href": "https://truecalci.com/api/health", "type": "application/json" }]
      }
    ]
  }
  ```

### 2.2 Guide AI Bots to Site Data (`Link Headers` — RFC 8288 & RFC 9727)
* **Goal**: Provide entry pointers in HTTP response headers on the homepage (`/`).
* **Requirements**:
  - Return `Link` HTTP response headers pointing to machine-readable resources.
  - Required registered relation types: `api-catalog`, `service-desc`, `service-doc`, `describedby`.
  - Format:
    ```http
    Link: </.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc", </llms.txt>; rel="service-doc", </.well-known/mcp.json>; rel="describedby"
    ```

### 2.3 Share Login Instructions for AI Bots (`Auth.md`)
* **Goal**: Publish automated registration and credential guidance for agents.
* **Requirements**:
  - Served at `/auth.md` as Markdown with an H1 heading starting with `# auth.md`.
  - Identify agent audience, registration endpoints, supported methods (`anonymous`, `verified_email`, `bearer_token`), and scopes (`tools:read`, `tools:execute`).
* **TrueCalci Reference**: [`/auth.md`](file:///c:/Calculator/auth.md)

---

## 3. Advanced Integration (Level 3 — 8/8)

### 3.1 Automate Security Handshakes (`OAuth / OIDC Discovery` — RFC 8414)
* **Goal**: Standard discovery endpoints for automated token issuance.
* **Requirements**:
  - Served at `/.well-known/oauth-authorization-server` and `/.well-known/openid-configuration`.
  - Must define: `issuer`, `authorization_endpoint`, `token_endpoint`, `jwks_uri`, `grant_types_supported`, `response_types_supported`.

### 3.2 Restrict Content Paths (`OAuth Protected Resource` — RFC 9728)
* **Goal**: Allow agents to discover how to authenticate to protected resources.
* **Requirements**:
  - Served at `/.well-known/oauth-protected-resource` with HTTP 200.
  - Must define: `resource`, `authorization_servers`, `scopes_supported`, `bearer_methods_supported: ["header"]`.

### 3.3 Introduce Your Site's AI to Other Agents (`A2A Agent Card`)
* **Goal**: Agent-to-Agent discovery per the A2A Protocol specification.
* **Requirements**:
  - Served at `/.well-known/agent-card.json` with HTTP 200.
  - Must define: `name`, `version`, `description`, `supportedInterfaces` (with `url`, `protocol`), `capabilities`, and `skills` array.

### 3.4 Verify Outbound Bots (`Web Bot Auth` — IETF WebBotAuth WG)
* **Goal**: Sign and verify requests sent between agents.
* **Requirements**:
  - Publish JWKS at `/.well-known/http-message-signatures-directory` and `/.well-known/jwks.json`.
  - Must contain at least one public key (RSA or Ed25519) with `kid`, `kty`, `use: "sig"`.

### 3.5 Let AI Agents Run In-Browser Tools (`WebMCP`)
* **Goal**: Expose DOM and page tools to browser-based agents (Claude Computer Use, ChatGPT Operator).
* **Requirements**:
  - Execute on page load: `navigator.modelContext.registerTool({ name, description, inputSchema, execute }, { signal })`.
  - Use `AbortController` signal for lifecycle management.

### 3.6 Publish AI Bots via DNS (`DNS for AI Discovery — DNS-AID`)
* **Goal**: DNS-based discovery of agent cards and MCP endpoints.
* **Requirements**:
  - Record in Cloudflare DNS under `_agents` namespace:
    - **Type**: `TXT`
    - **Name**: `_agents`
    - **Content**: `v=aid1; a2a=https://truecalci.com/.well-known/agent-card.json; mcp=https://truecalci.com/api/v1/mcp`
    - **Alternative SVCB**: `_a2a._agents.truecalci.com. 3600 IN SVCB 1 truecalci.com. alpn="a2a" port=443 mandatory=alpn,port`

### 3.7 List What Your Agent Can Do (`Skills Index`)
* **Goal**: Complete registry of callable calculations and actions.
* **Requirements**:
  - Served at `/.well-known/agent-skills/index.json`.
  - Lists skills with `id`, `name`, `description`, `category`, `documentation`, and `endpoint`.

### 3.8 Share Your AI Tool Context Engine (`MCP Server Card`)
* **Goal**: Discoverable Model Context Protocol manifest for Anthropic Claude Desktop and Cursor.
* **Requirements**:
  - Served at `/.well-known/mcp.json`.
  - Declares stdio and SSE remote transports, along with full tool parameter JSON schemas.

---

## 4. Master Cloudflare Validation Endpoint
To scan any domain programmatically:
```http
POST https://isitagentready.com/api/scan
Content-Type: application/json

{"url": "https://truecalci.com"}
```
