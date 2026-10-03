# F5 — Private Messaging

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §F5.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F5 |
| **Section** | Private Messaging |
| **Severity** | MAJOR |
| **Markets** | United States |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | Team project — TBD |
| **Depends on** | F1, F4 |
| **Unblocks** | None |

---

## 1. Problem Statement

After a New Mom and a Senior Mom are matched on MomConnect, they need a private way to communicate about their support arrangements. Without in-app messaging, users must rely on external communication tools to coordinate schedules and discuss support needs. This feature will allow matched users to communicate within MomConnect and make it easier to arrange and coordinate support.

## 2. Goals

- Allow matched users to exchange private text messages.
- Allow users to view their conversation history.
- Restrict conversations to authorized participants.
- Provide a simple, responsive messaging interface.
- Integrate messaging with the existing matching feature.

## 3. Non-Goals

- Group messaging or public chat rooms.
- Messaging users who have not matched.
- Image, video, or file attachments.
- Voice or video calls.
- Push notifications or email notifications.
- Read receipts or typing indicators.
- Advanced message search.
- Message editing or deletion.
- End-to-end encryption beyond the initial MVP scope.

## 4. Personas & User Stories

- **As a New Mom**, I want to message a matched Senior Mom so that I can discuss my support needs and coordinate arrangements.
- **As a Senior Mom**, I want to message a matched New Mom so that I can clarify the support I will provide.
- **As a matched user**, I want to view previous messages so that I can review our conversation.
- **As a user**, I want my conversations to remain private so that other users cannot read my messages.
- **As a user**, I want to access messaging from my matched support activity so that I can communicate without leaving MomConnect.

## 5. Functional Requirements

- **FR-1.** The system MUST require authentication before allowing access to private conversations.
- **FR-2.** The system MUST associate each conversation with an existing match.
- **FR-3.** The system MUST allow only participants in the associated match to access its conversation.
- **FR-4.** The system MUST allow authorized participants to send text messages.
- **FR-5.** The system MUST store each message with a unique ID, conversation ID, authenticated sender ID, message content, and creation timestamp.
- **FR-6.** The system MUST allow authorized participants to retrieve their conversation history.
- **FR-7.** The system MUST display messages in chronological order and identify each sender.
- **FR-8.** The system MUST reject empty or whitespace-only messages.
- **FR-9.** The system MUST prevent users from impersonating another sender or accessing conversations associated with other matches.
- **FR-10.** The system MUST display appropriate loading, empty, and error states.
- **FR-11.** The system SHOULD provide a clear way to open a conversation from the relevant matched support activity.
- **FR-12.** The system SHOULD display the date or time each message was sent.
- **FR-13.** The system MAY support real-time message updates in a future iteration.

## 6. Non-Functional Requirements

- **Performance** — Conversation history and message sending SHOULD complete within 2 seconds at the 95th percentile under normal development or pilot-test conditions, excluding network delays outside the application's control. Message history requests SHOULD be limited to a reasonable page size, such as 50 messages.
- **Security** — The system MUST authenticate users and enforce authorization on the server or database. Message access MUST be restricted to participants in the associated match. Client-side checks alone are insufficient. Messages MUST be transmitted over HTTPS in deployed environments.
- **Privacy & Compliance** — The system MUST restrict access to private messages and avoid exposing message content in application logs. Applicable privacy obligations MUST be reviewed before production deployment. Specific legal compliance requirements remain to be confirmed.
- **Accessibility** — New UI MUST target WCAG 2.1 AA. Message input, send controls, and conversation navigation MUST be keyboard accessible and have appropriate accessible labels.
- **Scalability** — The initial MVP SHOULD support a small student-project pilot without introducing additional infrastructure solely for anticipated future growth. Message history SHOULD support pagination if conversations grow.
- **Reliability** — The system MUST preserve successfully stored messages. Failed sends MUST display an error and allow the user to retry. The interface MUST NOT indicate that a message was sent successfully unless the server confirms the operation.
- **Observability** — The application SHOULD record message-send failures, authorization failures, and API errors without logging private message content.
- **Maintainability** — Messaging logic SHOULD remain separate from authentication and matching logic. Existing project conventions and shared data models MUST be reused where practical.
- **Internationalization** — User-facing strings SHOULD be externalized where the project supports localization. Message timestamps SHOULD be displayed in the user's local time.
- **Backward compatibility** — The feature MUST NOT break existing authentication, support-post, or matching functionality. Any required database migration MUST preserve existing records.

## 7. Acceptance Criteria

- **AC-1. Successful messaging**

  Given two authenticated users with an existing match, when one user sends a non-empty message, then the system stores the message and makes it available to the authorized participants.

- **AC-2. Conversation history**

  Given a conversation containing multiple messages, when an authorized participant opens it, then the system displays the messages in chronological order with the correct sender information.

- **AC-3. Unauthorized access**

  Given a user who is not a participant in a conversation, when that user attempts to retrieve the conversation or its messages, then the system denies access.

- **AC-4. Unmatched users**

  Given two users without an eligible match, when one user attempts to access a private conversation with the other, then the system does not allow the conversation to be created or accessed through this feature.

- **AC-5. Message validation**

  Given an authorized participant, when the participant attempts to send an empty or whitespace-only message, then the system rejects the message and does not store it.

- **AC-6. Message persistence**

  Given a successfully stored message, when the participant leaves the conversation and opens it again, then the message remains available.

- **AC-7. Sender identity**

  Given an authenticated participant, when the participant sends a message, then the system records the authenticated user's ID as the sender and ignores any untrusted sender ID supplied by the client.

- **AC-8. Empty conversation**

  Given a valid conversation without messages, when an authorized participant opens it, then the system displays an appropriate empty state and allows the participant to send the first message.

- **AC-9. Send failure**

  Given a message that cannot be saved because of a server or network error, when the user attempts to send it, then the interface displays an error and does not falsely indicate successful delivery.

- **AC-10. Responsive interface**

  Given a user accessing MomConnect on a desktop or mobile device, when the user opens a conversation, then the message history and message input remain usable at the available screen size.

## 8. Data Model

The feature SHOULD reuse existing user and matching records.

### Conversations

A conversation represents private communication associated with an existing match.

| Field | Type | Description |
|---|---|---|
| id | UUID or project-standard ID | Primary key |
| match_id | Existing match ID type | Reference to the associated match |
| created_at | Timestamp | Conversation creation time |

### Messages

A message represents one text message within a conversation.

| Field | Type | Description |
|---|---|---|
| id | UUID or project-standard ID | Primary key |
| conversation_id | Conversation ID type | Reference to the conversation |
| sender_id | Existing user ID type | Reference to the authenticated sender |
| content | Text | Message content |
| created_at | Timestamp | Message creation time |

### Constraints and Indexes

- The conversation ID MUST be unique.
- Each conversation MUST reference an existing match.
- Each message MUST reference an existing conversation.
- Each message MUST reference an existing user.
- The database MUST support efficient retrieval of messages by conversation and creation time.
- The application MUST validate that the sender belongs to the conversation's associated match.
- Empty or whitespace-only messages MUST be rejected.

### Migration Strategy

- Reuse existing user and match tables.
- Add conversation and message tables only if equivalent structures do not already exist.
- Use the repository's existing migration conventions.
- If the repository uses `server/migrations/NNN_*.sql`, follow that naming convention.
- No backfill is expected for existing messages if messaging has not previously been implemented.
- Existing user and match records MUST remain unchanged.

## 9. API Surface

The exact routes MUST follow the existing backend conventions.

### Retrieve Conversations

**Suggested route:** `GET /api/conversations`

**Authentication:** Required.

Returns conversations associated with the authenticated user's eligible matches.

Example response:

```json
{
  "conversations": [
    {
      "id": "conversation-uuid",
      "matchId": "match-uuid",
      "createdAt": "2026-10-03T10:00:00Z"
    }
  ]
}
```

The server MUST return only conversations the authenticated user is authorized to access.

### Retrieve Message History

**Suggested route:** `GET /api/conversations/:conversationId/messages`

**Authentication:** Required.

Returns messages belonging to the specified conversation.

Example response:

```json
{
  "messages": [
    {
      "id": "message-uuid",
      "conversationId": "conversation-uuid",
      "senderId": "user-uuid",
      "content": "Hello! Let's discuss the support arrangements.",
      "createdAt": "2026-10-03T10:05:00Z"
    }
  ]
}
```

The server MUST verify conversation access before returning any messages.

### Send a Message

**Suggested route:** `POST /api/conversations/:conversationId/messages`

**Authentication:** Required.

Example request:

```json
{
  "content": "What time would work for you?"
}
```

The sender ID MUST be derived from the authenticated session rather than trusted from the request body.

The server MUST validate the message content and conversation permissions before saving the message.

### API Documentation

- API routes MUST follow the project's existing naming and response conventions.
- Request validation and error responses MUST be documented.
- OpenAPI documentation SHOULD be updated if the project already uses OpenAPI.

### Rate Limiting

The application SHOULD apply reasonable request limits to prevent message-spam abuse. A dedicated rate-limiting service is not required for the initial student-project MVP unless the existing infrastructure already supports one.

### Real-Time Communication

WebSocket or real-time subscription support is not required for the initial implementation. The application MAY use simple refresh or re-fetch behavior until real-time messaging is implemented.

## 10. UI / UX

### Pages and Components

The feature SHOULD include:

- A conversation list or entry point from matched support activity.
- A conversation header showing the matched user's basic information.
- A message history area.
- A message input field.
- A Send button.
- Loading, empty, and error states.

### Key User Flow

1. The user logs in to MomConnect.
2. The user opens their matched support activity.
3. The user selects the matched person or conversation.
4. The application loads the conversation history.
5. The user enters a text message.
6. The user selects Send.
7. The application validates and saves the message.
8. The updated conversation displays the saved message.

### UI States

- **Loading:** Display a loading indicator while retrieving messages.
- **Empty:** Display a friendly message when no messages exist.
- **Error:** Explain when messages cannot be loaded or sent and provide a retry option where appropriate.
- **Success:** Display the message after the server confirms it has been saved.
- **Unauthorized:** Prevent access and display an appropriate message or redirect the user.

### Responsive Behaviour

The conversation layout MUST work on desktop and mobile devices. The message input and Send button MUST remain accessible when the message history is long.

### Accessibility

- All interactive elements MUST have accessible names.
- Keyboard users MUST be able to navigate the conversation and send messages.
- New messages SHOULD be announced appropriately to assistive technology without repeatedly announcing the entire conversation.
- Text and interactive controls MUST meet applicable WCAG 2.1 AA requirements.

### Internationalization

User-facing strings SHOULD use the project's existing localization approach. Message timestamps SHOULD use the user's local time and an appropriate locale format.

## 11. AI / ML Considerations

Not applicable. This feature does not require AI or machine learning.

## 12. Integration Points

### Internal Modules

The implementation is expected to interact with:

- Authentication and session management from F1.
- Matching and match-status data from F4.
- Existing user-profile data.
- The application's existing database and backend services.
- The existing frontend navigation and component structure.

Exact file paths MUST be confirmed from the repository before implementation.

### External Services

No additional external service is required for the initial MVP.

If Supabase is selected as the project's backend, its database and Row Level Security (RLS) capabilities MAY be used to enforce conversation and message access policies.

The implementation MUST follow the backend technology already selected for MomConnect rather than introducing a second backend unnecessarily.

### Events

The initial implementation does not require webhooks or an external event queue.

## 13. Dependencies & Sequencing

### Must Ship After

- **F1 — User Registration and Login:** Messaging requires authenticated users.
- **F4 — Application and Matching Management:** Messaging requires an existing match to identify the authorized participants.

### Must Ship Before

- No additional feature is currently identified as depending directly on F5.

### Shared Infrastructure

- Existing authentication and session management.
- Existing user and matching data.
- Database tables and access-control policies for conversations and messages.
- Existing frontend routing and API infrastructure.

### Implementation Sequence

1. Confirm the data model and match-status rules.
2. Define the conversation and message schema.
3. Implement authorization rules.
4. Implement conversation and message retrieval.
5. Implement message sending.
6. Build the messaging interface.
7. Test functional behavior and access restrictions.
8. Integrate with the existing matched support activity.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorized users access private messages | M | H | Enforce server-side authorization and database security policies. |
| Messages are associated with the wrong match | L | H | Validate the relationship between the conversation, match, and participants. |
| Users impersonate other senders | M | H | Derive sender identity from the authenticated session. |
| Message sending fails unexpectedly | M | M | Handle failures explicitly and provide a retry option. |
| Implementation exceeds the project timeline | M | M | Limit the MVP to text messages and basic history retrieval. |
| Existing matching functionality breaks | L | M | Reuse existing match data and run regression tests. |
| Private message content appears in logs | M | H | Avoid logging message bodies and sensitive conversation data. |

## 15. Rollout Plan

### Feature Flag

- **Suggested name:** `ENABLE_PRIVATE_MESSAGING`
- **Default state:** Disabled until the feature passes initial testing, if feature flags are supported by the project.

A new feature-flag system MUST NOT be introduced solely for this feature unless required by the team.

### Migration and Deployment

1. Review existing user and match schemas.
2. Add the required conversation and message structures if they do not already exist.
3. Apply database access policies.
4. Deploy the backend and frontend changes.
5. Enable messaging for test accounts.
6. Verify that matched users can communicate and unauthorized users cannot access conversations.

### Pilot

Test the feature with a small number of team-controlled accounts representing matched New Moms and Senior Moms.

### General Availability Criteria

Messaging is ready for wider use when:

- All acceptance criteria pass.
- Authorization tests pass.
- Message persistence is verified.
- The interface works on desktop and mobile devices.
- Existing authentication and matching functionality remains operational.

### Rollback

If a critical issue occurs, disable access to the messaging interface and API while investigating the problem.

Do not delete successfully stored messages as part of a routine rollback. Database changes MUST follow the repository's migration and rollback conventions.

## 16. Test Plan

### Unit Tests

- Validate message content.
- Reject empty and whitespace-only messages.
- Verify message serialization and timestamp handling.
- Verify sender identity is derived from the authenticated user.
- Verify conversation and match authorization logic.

### Integration Tests

- Retrieve conversations for an authenticated user.
- Retrieve messages for an authorized conversation.
- Send and persist a message.
- Reject requests from users who are not conversation participants.
- Reject attempts to access conversations belonging to unrelated matches.
- Verify behavior when the database or API returns an error.

### End-to-End Tests

Using the project's existing E2E framework, such as Playwright if available:

- Log in as a New Mom and open an eligible conversation.
- Send a message and verify it appears in the conversation.
- Log in as the matched Senior Mom and verify the message is visible.
- Send a reply and verify both messages appear in chronological order.
- Reload the conversation and verify message persistence.
- Verify that an unmatched user cannot start a conversation.
- Verify that a user cannot open another match's conversation.

### Security Tests

- Test the authorization matrix for conversation participants and non-participants.
- Attempt to access conversations by modifying conversation IDs.
- Attempt to impersonate another sender.
- Verify that unauthorized database reads and writes are denied.
- Verify that message content is safely rendered.

### Accessibility Tests

- Verify keyboard navigation and focus order.
- Verify accessible names for the message input and Send button.
- Run automated accessibility checks using axe if available.
- Manually verify that screen readers can identify message content and sender information.

### Performance Tests

- Measure conversation-history retrieval and message-send response times.
- Verify that pagination or message limits prevent excessively large responses.
- Target the performance thresholds defined in Section 6 under normal pilot-test conditions.

A separate load-testing platform is not required for the initial student-project MVP.

### Manual Exploratory Tests

- Test empty conversations.
- Test long messages.
- Test repeated send attempts.
- Test network failures.
- Test mobile layouts.
- Test session expiration during a conversation.
- Verify that private message content does not appear in public pages or unauthorized responses.

## 17. Documentation & Training

- Update the project's README or user documentation with basic messaging instructions if needed.
- Document how users access conversations through their matches.
- Document the conversation and message data models.
- Document the authorization rules and database policies.
- Update API documentation if the project maintains an API reference.
- Document any required environment variables or deployment settings.
- No separate instructor or administrator guide is required for the initial MVP.

## 18. Open Questions

1. Does F4 define a single final match status that determines when messaging becomes available?
2. Should an approved application immediately create a conversation, or should the conversation become available only after the match is formally confirmed?
3. Which backend technology has been finalized for MomConnect?
4. Does the existing backend already provide database security policies or reusable authorization helpers?
5. Should conversations remain readable after a match is cancelled or completed?
6. Is real-time message delivery required for the course evaluation, or is retrieving saved messages sufficient?
7. Does the repository already have a feature-flag mechanism, or should the feature simply be enabled after testing?

These decisions SHOULD be resolved before implementation begins. The initial MVP can proceed with persistent text messaging and strict participant-based access control once the matching rules and backend technology are confirmed.

## 19. References

### Internal References

- [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) — Source of the missing-feature requirements.
- F1 — User Registration and Login: Related feature plan; exact repository path to be confirmed.
- F4 — Application and Matching Management: Related feature plan; exact repository path to be confirmed.
- Existing user, matching, authentication, and database modules: Exact paths to be confirmed from the repository.

### External References

- [RFC 2119 — Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [W3C Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)

### Related Plans

- F1 — User Registration and Login.
- F4 — Application and Matching Management.