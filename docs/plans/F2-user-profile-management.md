# F2 — User Profile Management

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) § User Profile Management.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F2 |
| **Section** | User Profile Management |
| **Severity** | Must Have |
| **Markets** | United States |
| **Status** | Planned |
| **Effort** | Small |
| **Owner** | TBD |
| **Dependencies** | F1 — User Registration and Login |

## 1. Overview

F2 allows registered users to create, view, and edit their basic profiles on MomConnect.

Profiles help New Moms and Senior Moms learn basic information about each other before requesting or providing support.

This feature provides the basic user information needed for the MVP. It does not include identity verification, reviews, ratings, or advanced profile discovery.

## 2. Goals

- Allow registered users to create and maintain their profiles.
- Display each user's role as New Mom or Senior Mom.
- Help users understand who they may interact with on MomConnect.
- Ensure users can edit only their own profiles.

## 3. Non-Goals

The following are outside the scope of F2:

- Identity verification or background checks.
- Public ratings and reviews.
- Advanced profile search or recommendations.
- Private messaging.
- Support Request or Support Offer creation.
- Social login or authentication management.
- Administrative user management.

## 4. User Stories

- As a registered user, I want to create a profile so that other users can learn basic information about me.
- As a registered user, I want to edit my profile so that my information stays up to date.
- As a user, I want to view another user's profile so that I can learn about them before interacting.
- As a user, I want to see whether someone is a New Mom or Senior Mom so that I can understand their role on MomConnect.

## 5. Functional Requirements

Requirements use RFC 2119 terminology: MUST, SHOULD, and MAY indicate the level of requirement.

### FR-1: Create a Profile

A registered user MUST be able to create a profile.

The profile MUST include:

- Display name
- User role
- General location

The profile MAY include:

- Short introduction or bio

A user MUST NOT be required to provide a precise home address.

### FR-2: User Role

Each profile MUST have one of the following roles:

- `new_mom`
- `senior_mom`

The role MUST be selected from the supported options.

The role MUST be displayed on the user's profile.

### FR-3: View a Profile

A registered user MUST be able to view their own profile.

A user MUST be able to view another user's profile when the profile is available to authenticated users.

The profile MUST display the user's display name, role, and general location.

If a bio is provided, it MUST also be displayed.

### FR-4: Edit a Profile

A user MUST be able to edit their own display name, general location, and bio.

A user MUST NOT be able to edit another user's profile.

The system MUST associate each profile with the authenticated user's account.

### FR-5: Data Validation

The system MUST validate required profile fields before saving.

The system MUST reject invalid user roles.

The system MUST display a helpful message when profile information cannot be saved.

### FR-6: Authentication

Only authenticated users MUST be allowed to create or edit profiles.

The system MUST use the authentication established by F1 — User Registration and Login.

## 6. Acceptance Criteria

### AC-1: Create a Profile

**Given** a registered user has signed in and does not have a completed profile,  
**When** the user enters the required information and saves the profile,  
**Then** the system saves the profile and associates it with the authenticated account.

### AC-2: Validate Required Fields

**Given** a user is creating or editing a profile,  
**When** the user submits the form without a required field,  
**Then** the system displays a validation message and does not save the invalid profile.

### AC-3: Select a User Role

**Given** a user is creating a profile,  
**When** the user selects New Mom or Senior Mom,  
**Then** the system saves the selected supported role.

### AC-4: View a Profile

**Given** a profile exists,  
**When** an authenticated user opens that profile,  
**Then** the system displays the available profile information.

### AC-5: Edit Own Profile

**Given** a user has an existing profile,  
**When** the user updates their own profile and saves the changes,  
**Then** the system saves the updated information.

### AC-6: Prevent Unauthorized Editing

**Given** a user attempts to edit another user's profile,  
**When** the system processes the request,  
**Then** the system denies the modification and preserves the original profile.

### AC-7: Require Authentication

**Given** a visitor is not authenticated,  
**When** the visitor attempts to create or edit a profile,  
**Then** the system prevents the operation and directs the visitor to sign in.

### AC-8: Handle Save Errors

**Given** a user submits valid profile information,  
**When** the system cannot save the information because of a server or database error,  
**Then** the system displays an error message and does not report the save as successful.

## 7. Data Requirements

### Profile Data Model

The profile MUST contain the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | UUID | Yes | Unique profile identifier |
| `user_id` | UUID | Yes | Authenticated user's account ID |
| `display_name` | String | Yes | Name displayed to other users |
| `role` | Enum/String | Yes | `new_mom` or `senior_mom` |
| `location` | String | Yes | General geographic location |
| `bio` | String | No | Short introduction |
| `created_at` | Timestamp | Yes | Profile creation time |
| `updated_at` | Timestamp | Yes | Last update time |

The `user_id` field MUST uniquely identify the account associated with the profile.

A user MUST have no more than one profile associated with the same account.

The database MUST enforce appropriate access controls to prevent users from modifying profiles belonging to other accounts.

## 8. API / Backend Requirements

The implementation MUST support the following operations:

| Operation | Description |
|---|---|
| Create profile | Save a new profile for the authenticated user |
| Get own profile | Retrieve the authenticated user's profile |
| Get public profile | Retrieve another user's available profile information |
| Update profile | Update the authenticated user's profile |

The backend MUST verify the authenticated user's identity before creating or updating a profile.

The backend MUST enforce profile ownership independently of frontend validation.

If Supabase is used, Row Level Security (RLS) policies SHOULD enforce ownership rules at the database level.

The implementation MUST NOT rely solely on hiding edit controls in the user interface to protect profile data.

## 9. UI Requirements

### Profile Creation Page

The page MUST include:

- Display name input
- User role selection
- General location input
- Optional short introduction field
- Save button

The page MUST show validation messages for missing or invalid required fields.

### Profile View Page

The page MUST display:

- Display name
- User role
- General location
- Short introduction, if available

Users MUST be able to identify whether the profile belongs to a New Mom or a Senior Mom.

### Profile Edit Page

The page MUST allow users to update their own profile information.

The page MUST provide a way to save changes and display the result of the save operation.

The interface SHOULD provide a clear way to return to the user's profile without saving changes.

## 10. Security and Privacy

- The system MUST require authentication for profile creation and editing.
- The system MUST enforce profile ownership on the backend.
- The system MUST NOT expose private authentication credentials in profile data.
- The system MUST NOT require precise home addresses.
- The system MUST validate user-submitted data.
- The system SHOULD limit the length of display names and bios.
- The system SHOULD collect only the personal information necessary for the MVP.

## 11. Error Handling

The system MUST handle the following cases:

- Required fields are missing.
- The selected role is invalid.
- The user is not authenticated.
- The user attempts to edit another user's profile.
- The profile cannot be found.
- A database operation fails.

Error messages SHOULD explain the problem clearly without exposing sensitive technical details.

## 12. Dependencies

### Required Dependencies

**F1 — User Registration and Login**

F1 provides user authentication and account identification.

F2 depends on F1 to associate profiles with authenticated users and protect profile modification operations.

### Related Features

- **F3 — Support Request and Offer Management:** Profile information can help users understand who created a support request or offer.
- **F4 — Support Discovery, Applications, and Matching:** Users may view profiles when considering support opportunities and applications.
- **F5 — My Support Activity and Status Management:** The user's profile may be accessible from their personal activity area.

These related features MUST NOT be required to complete the initial implementation of F2.

## 13. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Users attempt to edit another user's profile | Enforce ownership checks on the backend and database |
| Users submit incomplete or invalid data | Validate required fields before saving |
| Users provide overly personal location information | Request only a general location |
| Profile data cannot be saved | Display an error message and preserve the user's entered information where practical |
| Profile information is inconsistent with the authenticated account | Associate each profile with the authenticated user's account ID |

## 14. Rollout Plan

1. Confirm the profile fields and supported user roles.
2. Create the profile data model.
3. Configure authentication-related access controls.
4. Implement profile creation.
5. Implement profile viewing.
6. Implement profile editing.
7. Add validation and error handling.
8. Test profile ownership and access restrictions.
9. Verify that F2 works with F1 authentication.

F2 MUST be completed and tested before dependent profile-related functionality is integrated into later features.

## 15. Testing Requirements

### Functional Tests

- A registered user can create a profile.
- A user can view their own profile.
- A user can view another user's available profile.
- A user can edit their own profile.
- A profile displays the correct user role.
- Optional bio information is displayed when provided.

### Validation Tests

- Missing required fields are rejected.
- Invalid roles are rejected.
- Profile information is saved correctly.
- Save failures are communicated to the user.

### Security Tests

- Unauthenticated users cannot create or edit profiles.
- Users cannot update another user's profile.
- Database access controls prevent unauthorized modifications.
- Each account can have no more than one profile.

### Integration Tests

- A profile is associated with the correct authenticated account.
- Profile operations work with F1 authentication.
- Profile information can be accessed by dependent features as intended.

## 16. Definition of Done

F2 is complete when:

- [ ] Authenticated users can create profiles.
- [ ] Profiles contain all required fields.
- [ ] Users can view their own profiles.
- [ ] Users can view other users' available profiles.
- [ ] Users can edit their own profiles.
- [ ] Unauthorized profile modifications are prevented.
- [ ] Required fields and role values are validated.
- [ ] Errors are handled appropriately.
- [ ] Functional and security tests pass.
- [ ] The implementation works with F1 authentication.
- [ ] The feature matches the MomConnect Project Specification.

## 17. Out of Scope

The following functionality is explicitly excluded from F2:

- Identity verification
- Background checks
- Ratings and reviews
- Advanced profile search
- Recommendation algorithms
- Private messaging
- Support request creation
- Support offer creation
- Application management
- Matching management
- Administrative profile management

These capabilities may be considered separately if the project scope changes.

## 18. Implementation Notes

The implementation SHOULD use the same user ID as the authentication provider to associate each profile with its account.

If Supabase is selected for the project, the profile table SHOULD reference the authenticated user's ID and use Row Level Security to enforce ownership.

The frontend and backend MUST use consistent role values:

- `new_mom`
- `senior_mom`

The implementation MUST remain consistent with the project's existing technology choices and database schema.

## 19. References

- [Project Specification](../PROJECT_SPECIFICATION.md)
- [Missing Features](../MISSING_FEATURES.md)
- F1 — User Registration and Login