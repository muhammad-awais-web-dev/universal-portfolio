# MCP Schema Update Requests

## Context

During a Copilot session on 2026-03-02, it was discovered that the `universal-portfolio` MCP tool
`update_project` does not include `body_html` as an updatable field. When passed, the API silently
ignores it. This document tracks all missing or incomplete fields across MCP write tools that need
to be added to their schemas.

---

## 1. `update_project` — Missing Fields

**Problem:** `body_html` cannot be updated via the MCP tool. It is present in `get_project` responses
but absent from the `update_project` input schema.

**Fix:** Add the following fields to the `update_project` schema:

| Field | Type | Notes |
|---|---|---|
| `body_html` | `string` | Full rich HTML description of the project |
| `description` | `string` | Plain text description (verify if this is actually persisted) |
| `published_at` | `string` (ISO date) | Allow manually setting publish date |
| `image_gallery` | `array` | Array of image URLs for the project gallery |

---

## 2. `update_skill` — Review Needed

**Check:** Verify that `body_html` on skills is also updatable. The `create_skill` schema includes
`body_html` but confirm `update_skill` does too.

---

## 3. General Audit

For each write tool below, audit that all fields returned by the corresponding read tool are also
present in the write/update schema:

- [ ] `update_project` vs `get_project`
- [ ] `update_skill` vs `get_skill`
- [ ] `update_experience` vs `get_experience`
- [ ] `update_education` vs `get_education`
- [ ] `update_certification` vs `get_certification`
- [ ] `update_testimonial` vs `get_testimonial`
- [ ] `update_profile` vs `get_profile`

---

## 4. Suggested Next Steps for Copilot Session

1. Open the MCP server source code (likely in `~/Projects/universal-portfolio/` or similar).
2. Find where tool schemas are defined (look for `update_project`, `inputSchema`, or Zod/JSON Schema definitions).
3. Add `body_html` and other missing fields to the `update_project` input schema.
4. Ensure the underlying API handler/route also accepts and persists those fields.
5. Run the full audit from Section 3 and patch all other tools with missing fields.
6. Test by calling `update_project` with `body_html` via Copilot and verify the returned object reflects the change.

---

## Priority

**High** — `body_html` on `update_project` is the immediate blocker. A visitor-facing portfolio
project description cannot be shortened/updated via MCP without this fix.
