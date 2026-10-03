# F2 — User Profile Management

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) — User Profile Management.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F2 |
| **Section** | User Profile Management |
| **Severity** | MAJOR |
| **Markets** | United States |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | Individual / Team |
| **Depends on** | F1 — User Authentication & Role Setup |
| **Unblocks** | F3, F4, F5, F6 |

## 1. Problem Statement

MomConnect users need profiles to introduce themselves and understand who they may connect with. Without profile management, users cannot share their municipality or a short bio, or view other users' profiles before engaging in the support process.

## 2. Goals

- Allow users to create and edit their profiles.
- Store a municipality and short bio.
- Allow users to view other users' profiles.
- Protect personal information and prevent unauthorized profile changes.

## 3. Non-Goals

- Identity verification or background checks.
- Displaying exact home addresses.
- Private messaging, applications, or matching.
- Advanced profile customization.

## 4. Personas & User Stories

- **Requester Mom:** I want to view a Senior Mom's profile so I can learn more about her.
- **Senior Mom:** I want to add my municipality and bio so other users can learn about me.
- **All users:** I want to update my profile when my information changes.

## 5. Functional Requirements

- **FR-1 MUST:** Authenticated users can create and edit their own profiles.
- **FR-2 MUST:** Profiles include a display name, municipality, and short bio.
- **FR-3 MUST:** Users can view other users' profiles.
- **FR-4 MUST:** The system displays the user's role: Requester Mom or Senior Mom.
- **FR-5 MUST:** Users cannot edit another user's profile.
- **FR-6 SHOULD:** The interface provides validation messages for missing or invalid information.

## 6. Non-Functional Requirements

- **Performance:** Profile pages should load within 2 seconds under normal conditions.
- **Security:** Only the profile owner can update their profile.
- **Privacy & Compliance:** Do not display exact home addresses or unnecessary sensitive information.
- **Accessibility:** Forms and profile pages should support keyboard navigation and screen readers.
- **Scalability:** Profile storage should support additional users without major redesign.
- **Reliability:** Failed updates should show an error without losing entered information.
- **Observability:** Record relevant application errors without logging private profile content.
- **Maintainability:** Keep profile validation and data access consistent with the project architecture.
- **Internationalization:** Keep user-facing text ready for future localization.
- **Backward compatibility:** Profile changes must not break authentication or existing user records.

## 7. Acceptance Criteria

- **AC-1:** Given an authenticated user, when they submit valid profile information, then the profile is saved.
- **AC-2:** Given a user with an existing profile, when they edit and save it, then the updated information is displayed.
- **AC-3:** Given a user viewing another user's profile, when the profile loads, then its permitted information and role are displayed.
- **AC-4:** Given a user attempts to edit another user's profile, when the update is submitted, then the system rejects it.
- **AC-5:** Given invalid profile information, when the user submits the form, then clear validation messages appear.

## 8. Data Model

**Proposed table: `profiles`**

| Field | Description |
|---|---|
| `id` | Profile identifier |
| `user_id` | Associated authenticated user; unique |
| `display_name` | Name displayed to other users |
| `role` | Requester Mom or Senior Mom |
| `municipality` | User's municipality |
| `bio` | Short introduction |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

- `user_id` must reference an authenticated user.
- Role values must be restricted to the supported roles and remain consistent with F1.
- Apply appropriate length limits and validation to text fields.
- Restrict profile updates to the owner through server-side authorization and database policies where supported.
- If a schema change is needed, use the repository's migration conventions, such as `server/migrations/NNN_*.sql`.
- Backfill existing users only if necessary; avoid inventing profile information.

## 9. API Surface

Proposed endpoints; adapt them to the existing backend conventions.

- `GET /api/profiles/:userId` — View a user's profile.
- `PUT /api/profiles/me` — Create or update the authenticated user's profile.
- Validate requests on the server and return clear validation and authorization errors.
- Add rate limiting where appropriate and document endpoints in the project's API documentation or OpenAPI specification, if used.
- WebSockets are not required.

## 10. UI / UX

- **My Profile:** View and edit the current user's profile.
- **User Profile:** View another user's permitted profile information.
- **Profile Form:** Edit display name, municipality, and bio.
- **Loading state:** Show a loading indicator while profile data is retrieved.
- **Empty state:** Prompt users to complete missing profile information.
- **Error state:** Display a clear message when loading or saving fails.
- **Responsive design:** Support mobile and desktop screens.
- **Accessibility:** Provide form labels, keyboard navigation, and visible focus states.
- **Copy/i18n:** Use clear, supportive language and keep text easy to localize.

## 11. AI / ML Considerations

Not applicable. This feature does not require AI or machine learning.

## 12. Integration Points

- **F1 — User Authentication & Role Setup:** Identifies the current user and their role.
- **F3 — Support Board:** Uses profile information to help users understand who created a post.
- **F4 — Application & Matching Workflow:** Provides profile context when reviewing applicants.
- **F5 — 1-on-1 Messaging:** Helps matched users identify each other.
- **F6 — Request Lifecycle & History:** Connects user activity to the relevant account.

## 13. Dependencies & Sequencing

1. Implement F1 authentication and role setup.
2. Create the profile data structure and access controls.
3. Build profile creation, editing, and viewing interfaces.
4. Test authorization, validation, and integration with dependent features.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorized profile updates | M | H | Enforce server-side ownership checks and database access policies. |
| Users share excessive personal information | M | M | Avoid collecting exact addresses and provide guidance for bio content. |
| Incomplete profiles affect other features | M | M | Prompt users to complete required fields. |
| Profile data becomes inconsistent with authentication data | L | H | Keep user IDs and roles consistent with F1. |

## 15. Rollout Plan

1. Add the profile schema and access controls.
2. Implement profile creation, editing, and viewing.
3. Test with development accounts representing both roles.
4. Pilot with a small group of users before general release.
5. Release when acceptance criteria and security checks pass.
6. If serious issues occur, disable profile editing temporarily and roll back the migration only if safe and necessary.

## 16. Test Plan

- **Unit:** Test profile validation and business rules.
- **Integration:** Test profile storage, retrieval, and authorization.
- **E2E (Playwright):** Test creating, editing, and viewing profiles.
- **Security:** Verify that users cannot modify other users' profiles.
- **Accessibility:** Check keyboard navigation, form labels, and screen-reader support.
- **Performance:** Check profile loading under expected MVP usage.
- **Manual:** Test on mobile and desktop, including empty and error states.

## 17. Documentation & Training

- Document profile fields and validation rules.
- Explain how profile visibility and editing permissions work.
- Add brief user guidance for completing a profile safely.

## 18. Open Questions

- Should the display name be editable after registration?
- Should the bio have a maximum character limit, such as 300 characters?
- Should incomplete profiles be allowed to use the Support Board?
- Which municipality list or input format should the MVP use?

## 19. References

- `docs/MISSING_FEATURES.md` — User Profile Management.
- Project Specification — MVP Features.
- F1 — User Authentication & Role Setup.
- F3 — Support Board (Requests & Offers).
- F4 — Application & Matching Workflow.
- F5 — 1-on-1 Messaging.
- F6 — Request Lifecycle & History.