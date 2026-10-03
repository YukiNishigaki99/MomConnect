# F5 — Private Messaging

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §Private Messaging.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F5 |
| **Section** | Private Messaging |
| **Severity** | BLOCKER |
| **Markets** | Mothers seeking or providing local childcare support |
| **Status (today)** | MISSING |
| **Estimated effort** | M (2–4w) |
| **Owner (proposed)** | Development Team |
| **Depends on** | F1, F3 |
| **Unblocks** | F4 |

---

## 1. Problem Statement

Mothers need a private way to communicate before deciding whether to arrange childcare support. Without messaging, users cannot ask questions or build trust before meeting. This feature enables direct communication between users while supporting safer support arrangements.

## 2. Goals

- Enable private one-to-one conversations.
- Allow communication before applying for or approving support.
- Support multiple independent conversations for each support post.
- Store and display message history.

## 3. Non-Goals

- Group chats or video calls.
- Real-time notifications.
- File and image attachments.
- Automated identity or background verification.

## 4. Personas & User Stories

- **As a parent seeking help**, I want to message potential helpers before arranging childcare.
- **As a helper**, I want to ask questions before applying for a support opportunity.
- **As a user**, I want to communicate privately with multiple users about different arrangements.

## 5. Functional Requirements

- **FR-1.** The system MUST allow authenticated users to start a private conversation with another user.
- **FR-2.** The system MUST support multiple separate conversations related to the same support post.
- **FR-3.** The system MUST allow conversation participants to send and view messages.
- **FR-4.** The system MUST persist message history.
- **FR-5.** The system MUST prevent non-participants from accessing conversations or messages.
- **FR-6.** The system SHOULD display messages in chronological order.

## 6. Non-Functional Requirements

- **Performance** — Messages should load within 2 seconds under normal conditions.
- **Security** — Require authentication and enforce participant-level authorization.
- **Privacy & Compliance** — Minimize personal data exposure and follow applicable privacy requirements.
- **Accessibility** — Follow WCAG 2.1 AA.
- **Reliability** — Prevent duplicate messages during retries.
- **Maintainability** — Follow existing project conventions.
- **Internationalization** — Support externalized UI strings.

## 7. Acceptance Criteria

- **AC-1.** Given two authenticated users, when one sends a message, then the other can view it in their conversation.
- **AC-2.** Given a support post with multiple interested users, when the post owner communicates with them, then each conversation remains separate.
- **AC-3.** Given a non-participant, when they attempt to access a conversation, then access is denied.
- **AC-4.** Given an existing conversation, when a participant returns, then the previous messages remain available.

## 8. Data Model

- **Conversation:** `id`, `post_id`, `created_at`.
- **ConversationParticipant:** `conversation_id`, `user_id`.
- **Message:** `id`, `conversation_id`, `sender_id`, `content`, `created_at`.
- Add indexes for conversation participants and message history.
- Use repository migration conventions.

## 9. API Surface

- `POST /api/conversations` — Create or retrieve a conversation.
- `GET /api/conversations` — List the current user's conversations.
- `GET /api/conversations/:id/messages` — Retrieve message history.
- `POST /api/conversations/:id/messages` — Send a message.
- All endpoints MUST enforce authentication and participant authorization.

## 10. UI / UX

- Conversation list.
- Private chat screen with message history and a message input.
- Entry point from a support post or user profile.
- Loading, empty, and error states.
- Responsive layout and accessible controls.

## 11. AI / ML Considerations

Not applicable.

## 12. Integration Points

- Authentication (F1).
- Support Board (F3).
- Database and existing API modules.

## 13. Dependencies & Sequencing

- **Must ship after:** F1, F3.
- **Must ship before:** Completion of the full F4 application workflow.
- **Shared infrastructure:** Database and authenticated API.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorized message access | M | H | Enforce participant-level authorization |
| Spam or harassment | M | H | Add rate limits and plan reporting/blocking support |
| Messages sent to the wrong user | L | H | Clearly identify conversation participants |

## 15. Rollout Plan

- Enable messaging after authentication and support posts are available.
- Test with a small group before general release.
- Roll back by disabling messaging endpoints and UI while preserving stored messages.

## 16. Test Plan

- **Unit** — Message creation and validation.
- **Integration** — Conversation persistence and access control.
- **End-to-end** — Send, receive, and revisit messages.
- **Security** — Test unauthorized conversation access.
- **Accessibility** — Check keyboard navigation and screen-reader labels.
- **Manual** — Verify separate conversations for multiple users.

## 17. Documentation & Training

- Document messaging workflows and privacy expectations.
- Update API documentation.

## 18. Open Questions

1. Should users be able to block or report other users in the MVP?
2. Should unread-message indicators be included in the MVP?

## 19. References

- [README](README.md)
- [Project Specification](../PROJECT_SPECIFICATION.md)