---
name: Preview routing checks
description: Verify the routed browser endpoint as well as the underlying app server.
---

In an application-router project, a standalone workflow opening a port does not necessarily register a browser preview route. Validate the proxied root and the framework's WebSocket, not just direct service-port HTTP.

**Why:** A healthy Streamlit server returned HTTP 200 locally while the public preview root returned 404. Browser rendering only worked after the runtime had an artifact-owned route.

**How to apply:** When adding a non-template runtime or diagnosing an indefinite preview loader, check HTTP through the application router and the real-time connection before declaring the app ready.
