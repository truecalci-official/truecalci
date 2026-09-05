---
name: cloudflare-mcp-deployment
description: Protocol and troubleshooting guide for hosting and publishing Model Context Protocol (MCP) servers on Cloudflare Workers & Pages to public registries (Smithery, Glama, Cursor).
---

# Cloudflare Edge MCP Deployment & Registry Publishing

A comprehensive guide and troubleshooting protocol for deploying, hosting, and publishing Model Context Protocol (MCP) servers on Cloudflare Workers or Pages, specifically ensuring successful capability scanning by registries like Smithery.ai, Glama, and AI Agent gateways.

---

## 1. Cloudflare Error 530 (Origin DNS Error / Error 1016)

### Root Cause
Registry crawlers and validators (such as Smithery's `SmitheryBot`) often run on Cloudflare Workers. In Cloudflare's network architecture, when a Cloudflare Worker executes a `fetch()` subrequest to another domain hosted on Cloudflare:
- If the domain only uses standard zone route patterns (e.g. `pattern: "domain.com/*"` without a custom domain), Cloudflare's security loop-prevention logic **bypasses the Worker** and attempts to resolve the DNS **Origin Server**.
- Because modern edge/serverless projects have no underlying physical origin server, Cloudflare's origin lookup fails, returning:
  $$\text{Cloudflare Error 1016: Origin DNS Error} \longrightarrow \mathbf{\text{HTTP 530}}$$

### Remediation Protocol
1. **Authoritative Custom Domain Binding**:
   Attach the custom domain in `wrangler.jsonc` using `custom_domain: true`. This makes the Worker authoritative at the edge so Worker-to-Worker subrequests execute the Worker code directly instead of looking for an external origin:
   ```jsonc
   "routes": [
     {
       "pattern": "yourdomain.com",
       "custom_domain": true
     }
   ]
   ```
2. **Enable `workers.dev` as Fallback**:
   Always set `"workers_dev": true` in `wrangler.jsonc`. This provides an unproxied, native endpoint (`https://<worker>.<subdomain>.workers.dev`) completely immune to apex zone DNS fallthrough.

---

## 2. Resolving Custom Domain Collisions (`code: 100117`)

### Symptom
When deploying with `wrangler deploy`, you may see:
```text
X [ERROR] Trigger configuration for "<worker>" was only partially updated:
    Custom domains:
      - Hostname 'www.yourdomain.com' already has externally managed DNS records. [code: 100117]
No targets deployed for <worker>
```
If this occurs, **Cloudflare aborts all trigger updates**, meaning the Worker custom domain never goes live at the edge.

### Resolution
- Inspect existing DNS records in Cloudflare Dashboard $\rightarrow$ **DNS** $\rightarrow$ **Records**.
- If a subdomain (e.g., `www`) has existing static `A` or `CNAME` records pointing elsewhere, remove the subdomain from the `custom_domain` array in `wrangler.jsonc` or delete the conflicting DNS record so Wrangler can manage it automatically.

---

## 3. Pre-Flight DNSSEC Integrity Verification

### Symptom
Scanners or public resolvers report `SERVFAIL` (Status `2`), even though local machine caches may still resolve the domain.

### Diagnostic Command
Check authoritative resolution via DoH (DNS over HTTPS):
```bash
node -e "
async function check() {
  const g = await (await fetch('https://dns.google/resolve?name=yourdomain.com&type=A')).json();
  const c = await (await fetch('https://cloudflare-dns.com/dns-query?name=yourdomain.com&type=A', { headers: { 'accept': 'application/dns-json' } })).json();
  console.log('Google Status:', g.Status, 'Cloudflare Status:', c.Status);
}
check();
"
```
- Status `0` = `NOERROR` (Healthy)
- Status `2` = `SERVFAIL` (Broken DNSSEC chain / Stale DS records at domain registrar)

### Resolution
If Status is `2`, log in to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains) and remove all stale **DS (Delegation Signer)** records.

---

## 4. SEP-1649 Static Server Card & Link Header Specification

Smithery and modern MCP clients support static capability advertising via [SEP-1649](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649). This allows scanners to extract all tool metadata without executing interactive initialization calls.

### 1. Host `/.well-known/mcp/server-card.json`
Serve the capability card at both `/.well-known/mcp/server-card.json` and `/.well-known/mcp.json`:
```json
{
  "serverInfo": {
    "name": "your-mcp-server",
    "version": "2.0.0",
    "description": "Your server description."
  },
  "configSchema": {
    "type": "object",
    "properties": {}
  },
  "authentication": {
    "required": false
  },
  "transport": {
    "type": "http",
    "url": "https://yourdomain.com/mcp"
  },
  "tools": [
    {
      "name": "tool_name",
      "description": "Tool description.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "param1": { "type": "string" }
        },
        "required": ["param1"]
      }
    }
  ],
  "resources": [],
  "prompts": []
}
```

### 2. Advertise via HTTP `Link` Header
On all root, discovery, and `/mcp` responses, return:
```http
Link: </.well-known/mcp/server-card.json>; rel="server-card", </.well-known/mcp/server-card.json>; rel="mcp-server-card"
```

---

## 5. RFC JSON-RPC 2.0 Edge Handshake Handlers

Ensure the Worker's POST handler cleanly handles:
1. `method: "initialize"`: Return `protocolVersion`, `capabilities: { tools: {} }`, and `serverInfo`.
2. `method: "notifications/initialized"`: Return **HTTP 204 No Content** (do NOT return 404 or error).
3. `method: "tools/list"`: Return all declared tools.
4. `method: "ping"`: Return empty result object `{}`.
5. `GET` on streamable HTTP route: Return `event: endpoint\ndata: https://yourdomain.com/mcp\n\n` when `Accept: text/event-stream` is requested.
