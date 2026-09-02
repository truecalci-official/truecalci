/**
 * Cloudflare Pages Advanced Mode Worker
 * Handles:
 * 1. Content negotiation for AI agents (Accept: text/markdown)
 * 2. RFC 8288 Link response headers on homepage
 * 3. RFC 9727 application/linkset+json for /.well-known/api-catalog
 * 4. Model Context Protocol SSE transport
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const accept = request.headers.get("Accept") || "";

    const LINK_HEADER = '</.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc", </llms.txt>; rel="service-doc", </.well-known/mcp.json>; rel="describedby"';

    // 1. Content Negotiation: If AI Agent requests Markdown for homepage
    if (accept.includes("text/markdown") && (url.pathname === "/" || url.pathname === "/index.html")) {
      const mdResponse = await env.ASSETS.fetch(new Request(new URL("/llms.txt", request.url), request));
      const mdText = await mdResponse.text();
      return new Response(mdText, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Vary": "Accept",
          "Link": LINK_HEADER,
          "Content-Signal": "ai-train=yes, ai-input=yes, search=yes",
          "TDM-Reservation": "0"
        }
      });
    }

    // 2. Fallback to static assets
    const response = await env.ASSETS.fetch(request);

    // 3. Inject Link headers on HTML responses
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("text/html") || url.pathname === "/" || url.pathname === "") {
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Link", LINK_HEADER);
      newHeaders.set("Content-Signal", "ai-train=yes, ai-input=yes, search=yes");
      newHeaders.set("TDM-Reservation", "0");
      newHeaders.set("Vary", "Accept");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }

    // 4. Ensure application/linkset+json for /.well-known/api-catalog
    if (url.pathname === "/.well-known/api-catalog") {
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Content-Type", "application/linkset+json; charset=utf-8");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }

    return response;
  }
};
