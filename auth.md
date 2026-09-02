# auth.md

Welcome to the TrueCalci Autonomous Agent Registration and Authentication Handbook.

## 1. Agent Audience
This service is designed for autonomous AI agents, LLM tool runners (Claude, ChatGPT, Gemini), and programmatic developer systems needing deterministic calculations for quantitative finance, engineering physics, statistics, and multi-regional taxation.

## 2. Authentication Methods Supported
TrueCalci supports three progressive authentication tiers for AI agents:

### Method A: Anonymous Read & Calculate (Default Tier)
- **Status**: No API key or registration required.
- **Access**: Full access to all 12 calculation endpoints and documentation.
- **Rate Limit**: 1,000 requests per minute per IP address.
- **Identity Types Supported**: `["anonymous"]`
- **Claim URI**: `https://truecalci.com/.well-known/oauth-protected-resource`

### Method B: Verified Email / Developer Registration
- **Registration Endpoint**: `POST https://truecalci.com/api/v1/agent/register`
- **Identity Types Supported**: `["verified_email"]`
- **Credential Types**: Bearer API Token (`tc_live_...`)
- **Header Format**: `Authorization: Bearer <YOUR_API_KEY>`
- **Scopes Supported**:
  - `tools:read` — Discover available tools, parameters, and documentation.
  - `tools:execute` — Execute high-throughput batch and Monte Carlo simulations.

### Method C: OAuth 2.0 & Protected Resource Metadata (RFC 9728 / RFC 8414)
- **Authorization Server**: `https://truecalci.com/.well-known/oauth-authorization-server`
- **Protected Resource**: `https://truecalci.com/.well-known/oauth-protected-resource`
- **Token Endpoint**: `https://truecalci.com/oauth/token`
- **Grant Types**: `["client_credentials", "authorization_code"]`
- **Bearer Methods**: `["header"]`

## 3. Provisioning & Discovery Links
- **OpenAPI 3.1 Catalog**: [https://truecalci.com/openapi.json](https://truecalci.com/openapi.json)
- **API Catalog (RFC 9727)**: [https://truecalci.com/.well-known/api-catalog](https://truecalci.com/.well-known/api-catalog)
- **Model Context Protocol**: [https://truecalci.com/.well-known/mcp.json](https://truecalci.com/.well-known/mcp.json)
- **A2A Agent Card**: [https://truecalci.com/.well-known/agent-card.json](https://truecalci.com/.well-known/agent-card.json)
