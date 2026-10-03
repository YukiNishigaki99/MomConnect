# F4 — Application and Matching Management

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §F4.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F4 |
| **Feature Name** | Application and Matching Management |
| **Priority** | High |
| **Type** | Core Feature |
| **Dependencies** | F1 — User Registration and Login; F2 — User Profile Management; F3 — Support Request and Offer Management |
| **Status** | Planned |

## 1. Overview

This feature allows New Moms and Senior Moms to apply for support opportunities posted on MomConnect.

Senior Moms can apply to Support Requests created by New Moms. New Moms can apply to Support Offers created by Senior Moms.

The creator of a post can review applications and approve or reject them. When an application is approved, a support match is created between the two users.

This feature helps mothers connect with each other and arrange peer support.

## 2. Goals

- Allow Senior Moms to apply to Support Requests.
- Allow New Moms to apply to Support Offers.
- Allow post creators to review applications.
- Allow post creators to approve or reject applications.
- Create a match when an application is approved.
- Prevent users from applying to their own posts.
- Provide clear application statuses.

### Non-Goals

- Automatic matching or recommendations.
- Complex scheduling or calendar integration.
- Online payments.
- Video calls or in-app messaging.
- Advanced application filtering.
- Managing multiple support sessions.

## 3. User Stories

**US-01: Apply for Support**

As a Senior Mom, I want to apply to a New Mom's Support Request so that I can offer help.

**US-02: Request an Offered Service**

As a New Mom, I want to apply to a Senior Mom's Support Offer so that I can receive the support I need.

**US-03: Review Applications**

As a post creator, I want to view applications for my post so that I can decide who to connect with.

**US-04: Approve an Application**

As a post creator, I want to approve an application so that a support arrangement can be established.

**US-05: Reject an Application**

As a post creator, I want to reject an application so that I can manage requests for my support opportunity.

**US-06: View Application Status**

As a user, I want to see the status of my applications so that I know whether my application is pending, approved, or rejected.

## 4. Functional Requirements

### FR-01: Submit an Application

- Authenticated users can apply to eligible posts created by other users.
- Senior Moms can apply to Support Requests.
- New Moms can apply to Support Offers.
- Users cannot apply to their own posts.
- A user cannot submit duplicate applications to the same post.
- The system records the applicant, target post, and application date.

### FR-02: View Applications

- Post creators can view applications submitted to their posts.
- Applicants can view their own applications.
- Application information includes the applicant, related post, submission date, and status.
- Users cannot view private application information belonging to unrelated users.

### FR-03: Approve an Application

- Only the creator of the related post can approve an application.
- The application status changes to `approved`.
- The system creates a support match between the applicant and the post creator.
- The approved application cannot be approved again.

### FR-04: Reject an Application

- Only the creator of the related post can reject an application.
- The application status changes to `rejected`.
- Rejected applications cannot be approved without submitting a new application, if the post remains available and the system permits resubmission.

### FR-05: Prevent Invalid Applications

- Users must be logged in before applying.
- Users cannot apply to their own posts.
- Users cannot apply to posts that are closed or no longer available.
- The system prevents duplicate applications.
- Only the post creator can approve or reject applications.

### FR-06: Create a Support Match

- An approved application creates one support match.
- The match records both users and the related Support Request or Support Offer.
- The match is associated with the approved application.
- A match cannot be created more than once for the same application.

## 5. Acceptance Criteria

| ID | Given | When | Then |
|---|---|---|---|
| AC-01 | A Senior Mom views an available Support Request created by another user | She submits an application | The application is saved with `pending` status |
| AC-02 | A New Mom views an available Support Offer created by another user | She submits an application | The application is saved with `pending` status |
| AC-03 | A user views their own post | They attempt to apply | The system prevents the application |
| AC-04 | A user has already applied to a post | They attempt to apply again | The system prevents a duplicate application |
| AC-05 | A post creator has a pending application | They approve it | The application becomes `approved` and a support match is created |
| AC-06 | A post creator has a pending application | They reject it | The application becomes `rejected` |
| AC-07 | A user views their submitted applications | They open the application list | They can see the status of each application |
| AC-08 | A user attempts to approve another user's application for a post they do not own | They submit the action | The system denies the action |
| AC-09 | An application has already been approved | The system processes the same approval again | No duplicate support match is created |
| AC-10 | A post is closed or unavailable | A user attempts to apply | The system prevents the application |

## 6. Data Requirements

The application and matching functionality requires two main data entities.

### Application

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique application identifier |
| `post_id` | UUID | ID of the related Support Request or Support Offer |
| `applicant_id` | UUID | ID of the user submitting the application |
| `status` | String | `pending`, `approved`, or `rejected` |
| `created_at` | Timestamp | Application submission date |
| `updated_at` | Timestamp | Last update date |

### Support Match

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique match identifier |
| `application_id` | UUID | ID of the approved application |
| `post_id` | UUID | ID of the related post |
| `applicant_id` | UUID | ID of the applicant |
| `post_owner_id` | UUID | ID of the post creator |
| `status` | String | Initial status: `active` |
| `created_at` | Timestamp | Match creation date |

### Data Relationships

- One post can have multiple applications.
- One user can submit multiple applications to different posts.
- Each application belongs to one applicant and one post.
- An approved application can create one support match.
- Each support match connects the applicant and the post creator.

The existing user and post models from F1, F2, and F3 should be reused.

## 7. API / Backend Requirements

The backend must support the following operations:

| Operation | Description |
|---|---|
| Create Application | Submit an application to a post |
| Get My Applications | Retrieve applications submitted by the current user |
| Get Post Applications | Retrieve applications for a post owned by the current user |
| Approve Application | Approve a pending application and create a match |
| Reject Application | Reject a pending application |
| Get My Matches | Retrieve support matches involving the current user |

### Backend Rules

- Require authentication for all application and matching operations.
- Verify the applicant's eligibility for the target post.
- Verify post ownership before allowing approval or rejection.
- Validate application status before changing it.
- Prevent duplicate applications using appropriate database constraints.
- Create the support match only when an application is successfully approved.
- Use an atomic database operation or transaction where supported to prevent an approved application from being saved without its corresponding match.
- Enforce authorization at the backend or database level, not only in the user interface.

## 8. UI Requirements

### Application Button

- Display an Apply button on eligible Support Requests and Support Offers.
- Show an appropriate message when the user cannot apply.
- Hide or disable the button for the user's own posts.
- Show confirmation when an application is submitted successfully.

### My Applications Page

Display