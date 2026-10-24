---
name: GitHub workflow pushes
description: A direct GitHub transport is needed for fine-grained-token workflow pushes.
---

When pushing GitHub Actions workflow files with a fine-grained token, use an explicit `https://github.com:443/` remote URL for that command and a temporary credential helper that reads the token from Replit Secrets. Never put the token in a remote URL or persistent Git configuration.

**Why:** A normal `https://github.com/` push was rewritten to Replit's internal GitHub OAuth proxy, which rejected workflow changes despite the supplied fine-grained token. Explicit port 443 bypassed that rewrite and the push succeeded.

**How to apply:** Use this only for the initial or updated workflow push when OAuth lacks workflow scope. Subsequent ordinary content pushes can use the existing origin. Ask the user to revoke the short-lived token and remove its Replit secret after verification.

For future Velouria changes, make and verify edits in Replit, but do not push them to GitHub or trigger a Pages deployment unless the user explicitly asks. The user will handle Git pushes.

**Why:** The user asked to handle Git pushes themselves rather than have changes published automatically.

**How to apply:** Stop after local verification; leave the work ready for the user to push.
