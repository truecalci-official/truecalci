# Glama.ai Registry Submission Guide for TrueCalci

This guide details the exact steps to submit and verify **TrueCalci** on **Glama.ai** (`https://glama.ai/mcp/servers`).

---

## 1. Submission Overview & Metadata

* **Server Name**: `truecalci` (or `io.github.truecalci-official/truecalci`)
* **Title**: `TrueCalci — Deterministic Compute Engine for AI Agents & Enterprise`
* **Homepage**: `https://truecalci.com`
* **GitHub Repository**: `https://github.com/truecalci-official/truecalci`
* **Transport Type**: `Streamable HTTP / SSE`
* **Endpoint URL**: `https://truecalci.com/api/v1/mcp`
* **Manifests Hosted**:
  * `https://truecalci.com/glama.json`
  * `https://truecalci.com/server.json`
  * `https://truecalci.com/.well-known/mcp.json`
  * `https://truecalci.com/.well-known/mcp/server-card.json`

---

## 2. Direct Web Registration on Glama

1. Navigate to **[https://glama.ai/mcp/servers](https://glama.ai/mcp/servers)**.
2. Sign in with GitHub account (`truecalci-official` or owner account).
3. Click **"Submit a Server"** or **"Add Server"**.
4. In the repository URL field, input:
   ```
   https://github.com/truecalci-official/truecalci
   ```
5. If prompted for the remote server endpoint, enter:
   ```
   https://truecalci.com/api/v1/mcp
   ```
6. Glama will automatically inspect `glama.json`, `server.json`, and ping `/api/v1/mcp` with an `initialize` JSON-RPC handshake.
7. Confirm the submission.

---

## 3. Automated Inspection Checks (All Green)

* **HTTP 200 Handshake**: `POST https://truecalci.com/api/v1/mcp` with `{"jsonrpc": "2.0", "method": "initialize", "id": 1}` responds with `serverInfo` and negotiated protocol version.
* **CORS Preflight**: `OPTIONS /api/v1/mcp` returns HTTP 204 with `Access-Control-Allow-Origin: *`.
* **Zero Authentication**: Open public tier requires zero API keys for introspection.
* **Cloudflare WAF**: Bot Fight Mode bypass rule allows `GlamaBot` crawler user-agent without triggering JavaScript challenge.

---

## 4. Verified Badge Snippet

Once indexed, add the verified Glama badge to `README.md`:

```markdown
[![Glama](https://glama.ai/mcp/servers/truecalci-official/truecalci/badge)](https://glama.ai/mcp/servers/truecalci-official/truecalci)
```
