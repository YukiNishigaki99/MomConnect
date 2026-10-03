# F1 — User Registration and Login

> Implementation plan. Source: `docs/MISSING_FEATURES.md` — User Registration and Login.

## Metadata

| Field | Value |
|---|---|
| Feature ID | F1 |
| Feature Name | User Registration and Login |
| Priority | High |
| Type | Authentication |
| Dependencies | None |
| Status | Planned |

## 1. Problem Statement

MomConnect connects New Moms who need childcare support with Senior Moms who can provide help.

Users need to create an account and log in before using features that require authentication. The application must identify each user and store their role so that other features can work correctly.

Without authentication, MomConnect cannot reliably associate support requests, support offers, applications, and messages with the correct users.

## 2. Goals and Non-Goals

### Goals

- Allow users to create an account using email and password.
- Allow users to sign in with Google.
- Allow users to sign in with Facebook.
- Allow users to select their role as New Mom or Senior Mom.
- Save user information in the database.
- Keep users signed in while their session is valid.
- Allow users to log out.
- Display helpful error messages when authentication fails.

### Non-Goals

- Apple login.
- X (Twitter) login.
- Instagram login.
- LINE login.
- Password reset.
- Two-factor authentication.
- Email verification.
- Advanced account management.

These features may be considered in future updates.

## 3. Personas and User Stories

### Persona 1: New Mom

**User Story:**

As a New Mom, I want to create an account and log in so that I can find childcare support from Senior Moms.

### Persona 2: Senior Mom

**User Story:**

As a Senior Mom, I want to create an account and log in so that I can offer support to New Moms.

## 4. Functional Requirements

- **FR-1:** The system MUST allow users to register with their name, email, password, and role.
- **FR-2:** The system MUST allow users to sign in with Google.
- **FR-3:** The system MUST allow users to sign in with Facebook.
- **FR-4:** The system MUST validate required fields and email format during registration.
- **FR-5:** The system MUST prevent duplicate accounts from being created with the same email address.
- **FR-6:** The system MUST securely handle passwords and MUST NOT store plain-text passwords.
- **FR-7:** The system MUST allow registered users to log in using email and password.
- **FR-8:** The system MUST create or retrieve the correct user profile after successful authentication.
- **FR-9:** The system MUST allow users to select New Mom or Senior Mom during registration.
- **FR-10:** The system MUST save the selected role in the user's profile.
- **FR-11:** The system MUST display an error message when authentication fails or is cancelled.
- **FR-12:** The system MUST maintain the user's authenticated session while it remains valid.
- **FR-13:** The system MUST allow authenticated users to log out.

## 5. Non-Functional Requirements

- **NFR-1 — Security:** Authentication MUST use a trusted authentication service.
- **NFR-2 — Password Security:** Passwords MUST be handled by the authentication service and MUST NOT be stored as plain text in the application database.
- **NFR-3 — Usability:** Registration and login forms MUST be simple and easy to understand.
- **NFR-4 — Privacy:** The application MUST NOT expose private user information to unauthorized users.
- **NFR-5 — Access Control:** Users MUST NOT be allowed to change their own role to Admin through the registration form.
- **NFR-6 — Session Management:** The application MUST recognize whether a user is authenticated before allowing access to protected features.

## 6. Acceptance Criteria

### AC-1: Successful Email Registration

**Given** a visitor does not have a MomConnect account,  
**When** they enter valid registration information and select a role,  
**Then** the system creates their account and saves their user profile.

### AC-2: Google Login

**Given** a visitor has a Google account,  
**When** they select "Continue with Google" and complete authentication,  
**Then** the system signs them in and retrieves their existing profile or creates a new profile.

### AC-3: Facebook Login

**Given** a visitor has a Facebook account,  
**When** they select "Continue with Facebook" and complete authentication,  
**Then** the system signs them in and retrieves their existing profile or creates a new profile.

### AC-4: First-Time Social Login

**Given** a visitor has not used MomConnect before,  
**When** they successfully sign in using Google or Facebook,  
**Then** the system creates a user profile and asks them to select a role if one has not already been assigned.

### AC-5: Duplicate Email

**Given** an account already exists with an email address,  
**When** a visitor attempts to register another account using the same email address,  
**Then** the system prevents the duplicate registration and displays an appropriate message.

### AC-6: Invalid Registration

**Given** a visitor opens the registration form,  
**When** they submit the form with missing or invalid information,  
**Then** the system displays validation errors and does not create an invalid account.

### AC-7: Failed Login

**Given** a visitor attempts to log in,  
**When** their credentials are incorrect or social authentication fails,  
**Then** the system does not create an authenticated session and displays an appropriate message.

### AC-8: Role Selection

**Given** a user is creating a MomConnect account,  
**When** they select New Mom or Senior Mom,  
**Then** the system saves the selected role in their profile.

### AC-9: Logout

**Given** a user is logged in,  
**When** they select Logout,  
**Then** the system ends their authenticated session.

## 7. Data Model, API, and UI

### Data Model

The application will use a `Users` table to store profile information.

| Field | Description |
|---|---|
| `id` | Unique user ID |
| `name` | User's name |
| `email` | User's email address |
| `role` | `requester`, `supporter`, or `admin` |
| `area_id` | User's municipality or area |
| `bio` | Short user introduction |

The user profile will be associated with the unique ID provided by the authentication service.

The role values will be mapped as follows:

- `requester` = New Mom
- `supporter` = Senior Mom
- `admin` = Administrator

The registration form will allow users to select only New Mom or Senior Mom. Admin accounts must be managed separately.

Password hashes and authentication credentials will be managed by the authentication service rather than stored in the public `Users` table.

### Authentication Approach

**Proposed service:** Supabase Auth.

Supabase Auth will handle:

- Email and password authentication.
- Google login.
- Facebook login.
- Authentication sessions.
- User identity and authentication status.

The application will maintain a separate user profile containing MomConnect-specific information, including the user's role.

### API and Data Access

If Supabase is selected, the application can use the Supabase client library to perform authentication and access authorized database records.

The initial implementation will include:

- User registration.
- Email and password login.
- Google login.
- Facebook login.
- User profile creation and retrieval.
- Logout.

Separate custom API endpoints will be added only if they are needed by the final application architecture.

### UI

The feature will include a Login and Registration View.

**Registration Form**
- Name
- Email
- Password
- Role selection
- Register button
- Continue with Google button
- Continue with Facebook button
- Link to the login form

**Login Form**
- Email
- Password
- Login button
- Continue with Google button
- Continue with Facebook button
- Link to the registration form

The interface will display appropriate error messages when registration or login fails.

## 8. Risks and Testing

### Risks

**Risk 1: Incorrect Role Assignment**

A user may receive the wrong role or attempt to register as an administrator.

**Mitigation:** Allow only New Mom and Senior Mom as registration choices. Protect administrative permissions separately.

**Risk 2: Duplicate User Profiles**

A user may sign in through a social provider more than once or encounter an existing account with the same email address.

**Mitigation:** Use the authentication provider's unique user ID to associate accounts with profiles. Handle duplicate-email and account-linking cases safely.

**Risk 3: Authentication Configuration Errors**

Google or Facebook login may fail if the provider settings or redirect URLs are incorrect.

**Mitigation:** Configure each provider correctly and test its login flow.

**Risk 4: Unauthorized Access**

An authenticated user may attempt to access another user's private information.

**Mitigation:** Apply appropriate database access policies and verify authorization for protected operations.

### Testing

- Test registration with valid information.
- Test registration with missing required fields.
- Test registration with an invalid email address.
- Test registration with an email address that is already in use.
- Test login with the correct email and password.
- Test login with an incorrect password.
- Test successful Google authentication.
- Test successful Facebook authentication.
- Test cancelling social authentication.
- Test profile creation after the first social login.
- Test that the correct user role is saved.
- Test that users cannot register themselves as Admin.
- Test that logout ends the authenticated session.
- Test that unauthenticated users cannot access protected features.
- Test that users cannot access another user's private data.

## 9. AI-Generated Plan Review

### Weakness 1: Authentication and User Profiles

**Problem:** An initial plan might store all user information and passwords directly in the application database.

**Improvement:** This plan separates authentication from the MomConnect user profile. The authentication service manages credentials, while the application stores profile information and roles.

### Weakness 2: Social Login and Role Selection

**Problem:** A user who signs in with Google or Facebook might not have a MomConnect role assigned.

**Improvement:** This plan requires first-time social-login users to complete role selection when necessary.

### Weakness 3: Duplicate Accounts

**Problem:** The same person might accidentally create separate accounts using different login providers.

**Improvement:** This plan associates profiles with authentication user IDs and requires duplicate-email and account-linking cases to be handled safely.

### Weakness 4: Access Control

**Problem:** A user might try to register as an Admin or access another user's private information.

**Improvement:** This plan separates public role selection from administrative permissions and requires access-control testing.

## 10. Reflection

This plan identifies the main requirements for user registration and login in MomConnect. It includes email and password authentication, Google login, and Facebook login. It also separates authentication from user profile information and role management. Reviewing the initial AI-generated plan helped identify missing requirements related to social login, duplicate accounts, and access control. The acceptance criteria and testing steps will help verify that each authentication method works correctly. The feature will provide the foundation for other MomConnect features, including support requests, support offers, applications, and messaging.