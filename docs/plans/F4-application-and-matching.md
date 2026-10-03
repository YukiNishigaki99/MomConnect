# F4 — Application & Matching

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §F4.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F4 |
| **Section** | Application & Matching |
| **Severity** | BLOCKER |
| **Markets** | Mothers seeking or providing local childcare support |
| **Status (today)** | MISSING |
| **Estimated effort** | M (2–4w) |
| **Owner (proposed)** | Development Team |
| **Depends on** | F1, F3 |
| **Unblocks** | F5, F6 |

---

## 1. Problem Statement

Mothers need a simple way to apply for support and connect with suitable helpers. Without an application and matching workflow, users cannot confirm support arrangements through the platform. This feature enables safe, organized connections between mothers.

## 2. Goals

- Allow users to apply to support posts.
- Allow post creators to review applications.
- Allow post creators to approve multiple applicants.
- Create a match for each approved application.

## 3. Non-Goals

- Private messaging (F5).
- Request lifecycle and history management (F6).
- Ratings, identity verification, and automated matching.

## 4. Personas & User Stories

- **As a mother seeking help**, I want to apply to a support offer so that I can receive childcare assistance.
- **As an experienced mother**, I want to apply to a support request so that I can offer help.
- **As a post creator**, I want to review and decide on applications so that I can choose a suitable match.

## 5. Functional Requirements

- FR-1. The system MUST allow authenticated users to apply to eligible support posts.
- FR-2. The system MUST prevent users from applying to their own posts.
- FR-3. The system MUST prevent duplicate applications to the same post.
- FR-4. The system MUST allow post creators to view and review applications.
- FR-5. The system MUST allow post creators to accept or reject individual applications.
- FR-6. The system MUST create a separate match for each accepted application.
- FR-7. The system MUST restrict application decisions to the post creator.

## 6. Non-Functional Requirements

- **Performance** — Application actions should complete within 2 seconds under normal conditions.
- **Security** — All application operations require authentication and appropriate authorization.
- **Privacy** — Application details are accessible only to authorized users.
- **Accessibility** — The UI supports keyboard navigation and accessible labels.
- **Reliability** — Concurrent application approvals must not create conflicting matches.
- **Maintainability** — Follow existing project conventions.

## 7. Acceptance Criteria

- **AC-1.** Given an eligible post, when a user applies, then an application is created.
- **AC-2.** Given an existing application, when the same user applies again, then the system prevents duplication.
- **AC-3.** Given an application, when the post creator accepts it, then a match is created.
- **AC-4.** Given an application, when an unauthorized user attempts to decide it, then the system denies the action.
- **AC-5.** Given a post that already has an accepted application, when another application is accepted, then the system prevents a conflicting match.

## 8. Data Model

- **Application** — Stores the post, applicant, status, and timestamps.
- **Match** — Stores the accepted application and matched users.
- Application statuses: `PENDING`, `ACCEPTED`, `REJECTED`.
- Add database constraints to prevent duplicate applications and conflicting matches.
- Create migration files using the repository's established convention.

## 9. API Surface

- `POST /api/posts/:id/applications` — Submit an application.
- `GET /api/posts/:id/applications` — List applications; post creator only.
- `PATCH /api/applications/:id` — Accept or reject an application; post creator only.
- All routes MUST enforce authentication and authorization.

## 10. UI / UX

- Add an application action to eligible support posts.
- Provide an application list for post creators.
- Display application statuses and decision controls.
- Include loading, empty, success, and error states.
- Ensure responsive layouts and accessible form controls.

## 11. AI / ML Considerations

Not applicable. Matching decisions are made by users.

## 12. Integration Points

- **F1:** Authentication and user roles.
- **F2:** User profile information.
- **F3:** Support requests and offers.
- **F5:** Matched users can communicate.
- **F6:** Matches and application outcomes support lifecycle tracking.

## 13. Dependencies & Sequencing

- **Must ship after:** F1, F3.
- **Must integrate with:** F2.
- **Must ship before:** F5, F6.
- **Shared infrastructure:** Database and authenticated API.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorized decisions | M | H | Enforce server-side authorization |
| Duplicate applications | M | M | Database constraints |
| Conflicting matches | M | H | Use database transactions and constraints |

## 15. Rollout Plan

- Implement database changes before enabling the workflow.
- Test application and matching flows in development.
- Enable the feature for MVP users.
- Roll back by disabling the application endpoints and UI if critical issues arise.

## 16. Test Plan

- **Unit:** Application validation and status transitions.
- **Integration:** Application creation, decisions, and match creation.
- **End-to-end:** Apply, review, accept, and reject workflows.
- **Security:** Unauthorized access and duplicate application attempts.
- **Manual:** Verify responsive layouts and error messages.

## 17. Documentation & Training

- Document application and matching workflows.
- Update API documentation.
- Record relevant implementation decisions.

## 18. Open Questions

1. Can a post creator accept only one application per post?
2. Should applicants be allowed to withdraw pending applications?

## 19. References

- [README](README.md)
- [Project Specification](../PROJECT_SPECIFICATION.md)