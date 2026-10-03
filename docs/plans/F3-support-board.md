# F3 — Support Board (Requests & Offers)

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §Support Board.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F3 |
| **Section** | Support Board |
| **Severity** | BLOCKER |
| **Markets** | Mothers seeking or providing local childcare support |
| **Status (today)** | MISSING |
| **Estimated effort** | M |
| **Owner (proposed)** | Development Team |
| **Depends on** | F1 |
| **Unblocks** | F4, F5, F6 |

---

## 1. Problem Statement

Single mothers need a simple way to request childcare support, while experienced mothers need a way to offer help. Without a shared support board, users cannot easily discover available support opportunities in their local communities.

## 2. Goals

- Allow users to create `Need Help` and `Can Help` posts.
- Display posts in a browsable list and detail view.
- Filter posts by municipality and post type.
- Allow users to edit and delete their own posts.

## 3. Non-Goals

- Applying for support or matching users (F4).
- Private messaging (F5).
- Notifications, ratings, and advanced map features.

## 4. Personas & User Stories

- **As a single mother**, I want to post a support request so that I can find childcare assistance.
- **As an experienced mother**, I want to offer support so that local families can find help.
- **As a user**, I want to filter posts by municipality and type so that I can find relevant opportunities.

## 5. Functional Requirements

- **FR-1.** The system MUST allow authenticated users to create `Need Help` and `Can Help` posts.
- **FR-2.** Each post MUST include a title, description, municipality, post type, and creation date.
- **FR-3.** The system MUST display posts in a list and provide a detail view.
- **FR-4.** The system MUST support filtering by municipality and post type.
- **FR-5.** Users MUST be able to edit and delete their own posts only.

## 6. Non-Functional Requirements

- **Performance** — Post lists SHOULD load within 2 seconds under normal conditions.
- **Security** — Authentication is required; users can modify only their own posts.
- **Privacy & Compliance** — Avoid collecting unnecessary personal information.
- **Accessibility** — Follow WCAG 2.1 AA for new UI.
- **Scalability** — Support pagination for post lists.
- **Reliability** — Display clear errors when requests fail.
- **Observability** — Log relevant errors without exposing sensitive data.
- **Maintainability** — Follow existing project conventions.
- **Internationalization** — Keep user-facing strings easy to translate.
- **Backward compatibility** — Use migrations for database changes.

## 7. Acceptance Criteria

- **AC-1.** Given an authenticated user, when they submit a valid post, then the post is saved and displayed.
- **AC-2.** Given existing posts, when a user selects a municipality or post type, then only matching posts are displayed.
- **AC-3.** Given a user's post, when another user attempts to edit or delete it, then the operation is rejected.
- **AC-4.** Given a user submits invalid or incomplete data, when they save the post, then validation errors are displayed.

## 8. Data Model

- Create a `posts` table with `id`, `user_id`, `type`, `title`, `description`, `municipality`, `status`, `created_at`, and `updated_at`.
- Restrict `type` to `need_help` or `can_help`.
- Add indexes for municipality, type, and creation date.
- Use the repository's existing migration conventions.

## 9. API Surface

- `GET /api/posts` — List posts with optional municipality and type filters.
- `POST /api/posts` — Create a post.
- `GET /api/posts/:id` — Retrieve post details.
- `PATCH /api/posts/:id` — Update own post.
- `DELETE /api/posts/:id` — Delete own post.
- Document endpoints and validation rules.

## 10. UI / UX

- Support board page with post list and filters.
- Post creation and editing form.
- Post detail page.
- Clear loading, empty, and error states.
- Responsive layouts for mobile and desktop.

## 11. AI / ML Considerations

Not applicable.

## 12. Integration Points

- Authentication and user roles from F1.
- Database for post storage and retrieval.
- Support board pages and components in the web client.

## 13. Dependencies & Sequencing

- **Must ship after:** F1.
- **Must ship before:** F4.
- **Shared infrastructure:** Authentication, database, and API.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorized post changes | M | H | Enforce server-side ownership checks. |
| Invalid or misleading content | M | M | Validate required fields and input lengths. |
| Slow post listing | L | M | Add indexes and pagination. |

## 15. Rollout Plan

- Enable the feature after F1 is available.
- Test post creation, listing, filtering, editing, and deletion.
- Fix critical issues before release.
- Roll back the feature if serious problems occur.

## 16. Test Plan

- **Unit** — Validate post fields and types.
- **Integration** — Test API endpoints and database operations.
- **End-to-end** — Test creating, browsing, filtering, editing, and deleting posts.
- **Security** — Verify authentication and post ownership.
- **Accessibility** — Check keyboard navigation and form labels.
- **Performance** — Verify acceptable response times.
- **Manual exploratory** — Test mobile layouts and error states.

## 17. Documentation & Training

- Document support board usage.
- Update API documentation.
- Record relevant setup and troubleshooting instructions.

## 18. Open Questions

1. Should users be allowed to temporarily close a post without deleting it?
2. What maximum lengths should apply to titles and descriptions?

## 19. References

- [README](README.md)
- [Project Specification](../PROJECT_SPECIFICATION.md)