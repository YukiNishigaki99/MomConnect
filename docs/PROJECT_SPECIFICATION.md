# MomConnect --- Project Specification

## 1. Project Overview

**Project Name:** MomConnect\
**Project Type:** Web Application\
**Course:** WDD 430\
**Project Stage:** Planning\
**Target:** Minimum Viable Product (MVP)

### 1.1 Project Description

MomConnect is a web application designed to connect new mothers who need
temporary support with experienced mothers who are willing to help.

Parenting a newborn can be physically and emotionally demanding. Some
mothers need a short break, practical assistance, or someone who
understands the challenges of caring for a baby. Finding suitable local
support can be difficult.

MomConnect provides a platform where mothers can request help, offer
support, communicate privately about a request or offer, and apply to
participate.

The application supports two-way interaction:

-   **New Moms** can post support requests and apply to support offers
    created by Senior Moms.
-   **Senior Moms** can post support offers and apply to support
    requests created by New Moms.

Users can use private messaging to ask questions, discuss support
details, and learn more about one another before deciding whether to
apply. The creator of a request or offer can then review applications
and approve or reject them. Messaging helps users communicate, but it
does not verify identity or guarantee safety.

The initial version will focus on five main features: authentication,
support requests, support offers, applications, and private messaging.

## 2. Problem Statement

New mothers may need temporary help while caring for a newborn, but they
may not have family members, friends, or other suitable support nearby.

At the same time, experienced mothers may be willing to help other
mothers but may not know who needs assistance or how to connect with
them.

Existing social networks can help people communicate, but they are not
necessarily organized around specific parenting support requests and
offers. Users may also want to ask questions and discuss expectations
privately before deciding whether to apply for or accept support.

MomConnect aims to address these needs by providing a dedicated platform
where mothers can publish support requests or offers, communicate
privately about them, and use an application and approval process to
arrange support.

## 3. Project Goals

The primary goals of MomConnect are to:

1.  Provide a simple way for users to create accounts and sign in.
2.  Allow New Moms to publish support requests.
3.  Allow Senior Moms to publish descriptions of the support they can
    provide.
4.  Enable users to browse relevant requests and offers and apply to
    them.
5.  Allow the creator of a request or offer to approve or reject
    applications.
6.  Provide private messaging so users can ask questions and discuss
    details before deciding whether to apply.
7.  Help users view their own posts and application statuses.

The MVP should demonstrate the basic workflow from publishing a request
or offer, through private communication and an application decision, to
viewing the resulting status.

## 4. Target Users

### 4.1 New Moms

New Moms are mothers who need assistance with newborn care or other
practical parenting-related tasks.

They can:

-   Create an account and sign in.
-   Publish a support request describing the help they need.
-   Browse support offers published by Senior Moms.
-   Privately message a user about a relevant request or offer before
    applying.
-   Apply to support offers that interest them.
-   Review the status of their applications.
-   Manage their own support requests.

**Example:** A New Mom needs someone to hold her newborn for a short
period while she rests. She publishes a support request describing her
needs, preferred time, and general location. She can message an
interested Senior Mom to discuss details before deciding whether to
proceed with an application.

### 4.2 Senior Moms

Senior Moms are experienced mothers who are willing to offer practical,
non-medical parenting support.

They can:

-   Create an account and sign in.
-   Publish support offers describing the assistance they can provide.
-   Browse support requests published by New Moms.
-   Privately message a user about a relevant request or offer before
    applying.
-   Apply to requests they are interested in.
-   Review the status of their applications.
-   Manage their own support offers.

**Example:** A Senior Mom is comfortable caring for newborns for short
periods. She publishes a support offer explaining that she can hold a
baby while the mother takes a short break. She can message an interested
New Mom to discuss the proposed support before either person decides
whether to proceed with an application.

### 4.3 User Roles

For the MVP, each user will select one primary role during registration:

-   New Mom
-   Senior Mom

The application will use this role to determine which support posts a
user can create and which application actions they can perform.

Advanced role switching and administrative roles are outside the initial
scope.

## 5. Minimum Viable Product (MVP)

The MVP will include five main feature groups.

### F1. User Authentication

Users can create an account, sign in, sign out, and access protected
features.

Authentication methods:

-   Email and password
-   Google sign-in
-   Facebook sign-in

Users select their primary role during registration. The application
will associate authenticated users with their own content and restrict
protected actions to authorized users.

A basic profile may include a display name, role, general location, and
short introduction when needed to support the main workflows. A
separate, advanced profile-management feature is not part of the MVP.

### F2. Create Support Request

New Moms can create and manage support requests describing the help they
need.

A request may include:

-   Title
-   Description
-   General location
-   Preferred date
-   Preferred start and end times

Users can view, edit, or delete their own requests. Required fields will
be validated before a request is saved.

### F3. Create Support Offer

Senior Moms can create and manage support offers describing the
assistance they are willing to provide.

An offer may include:

-   Title
-   Description of the available support
-   General location
-   Availability date or time information

Users can view, edit, or delete their own offers. Required fields will
be validated before an offer is saved.

### F4. Apply for Support

Users can browse support requests and offers relevant to their roles,
submit applications, and review application decisions. The creator of a
post can approve or reject applications submitted to that post.

The application supports two workflows.

**Workflow A: New Mom Requests Support**

1.  A New Mom creates a support request.
2.  A Senior Mom browses the available requests.
3.  The users may privately message each other to discuss the request
    before applying.
4.  The Senior Mom applies to the request.
5.  The New Mom reviews the application.
6.  The New Mom approves or rejects the application.
7.  If approved, the application becomes an accepted support arrangement
    and the related post is marked as matched.

**Workflow B: Senior Mom Offers Support**

1.  A Senior Mom creates a support offer.
2.  A New Mom browses the available offers.
3.  The users may privately message each other to discuss the offer
    before applying.
4.  The New Mom applies to the offer.
5.  The Senior Mom reviews the application.
6.  The Senior Mom approves or rejects the application.
7.  If approved, the application becomes an accepted support arrangement
    and the related post is marked as matched.

The post creator can review applications submitted to their own post.
Users cannot approve or reject applications for posts they do not
manage.

For the MVP, the application and approval workflow will remain simple.
Complex scheduling, automatic matching, and multiple overlapping support
arrangements will not be implemented.

### F5. Private Messaging

Authenticated users can privately message one another about support
requests or offers. Messaging is intended to help users ask questions,
discuss expectations and practical details, and learn more about each
other before deciding whether to apply.

The MVP messaging feature will include:

-   Starting or opening a private conversation in the context of a
    support request or offer.
-   Sending and viewing text messages.
-   Viewing the conversation history.
-   Restricting each conversation and its messages to its participants.
-   Allowing users to communicate before submitting an application or
    before an application is approved.

Messaging does not itself create an application or approve a support
arrangement. Users must still use the application workflow in F4 to
apply and receive an approval decision.

The MVP will not include file attachments, voice or video calls, read
receipts, advanced message search, or sophisticated notification
settings. Private messaging does not verify users or guarantee the
safety of either participant.

## 6. Functional Requirements

### FR-1: Authentication

-   The system shall allow users to register with an email address and
    password.
-   The system shall support Google and Facebook authentication after
    the providers are configured.
-   The system shall allow users to sign in and sign out.
-   The system shall associate authenticated users with their own
    profiles and content.
-   The system shall restrict protected actions to authenticated users.
-   The system shall store each user's primary role as New Mom or Senior
    Mom.

### FR-2: Create Support Request

-   The system shall allow New Moms to create support requests.
-   The system shall allow users to view available support requests.
-   The system shall allow users to edit and delete their own requests.
-   The system shall validate required fields before saving a request.
-   The system shall associate each request with its creator.
-   The system shall prevent unauthorized users from modifying another
    user's request.

### FR-3: Create Support Offer

-   The system shall allow Senior Moms to create support offers.
-   The system shall allow users to view available support offers.
-   The system shall allow users to edit and delete their own offers.
-   The system shall validate required fields before saving an offer.
-   The system shall associate each offer with its creator.
-   The system shall prevent unauthorized users from modifying another
    user's offer.

### FR-4: Applications and Matching

-   The system shall allow Senior Moms to apply to New Mom support
    requests.
-   The system shall allow New Moms to apply to Senior Mom support
    offers.
-   The system shall allow post creators to view applications submitted
    to their posts.
-   The system shall allow post creators to approve or reject
    applications to their own posts.
-   The system shall prevent unauthorized users from managing
    applications.
-   The system shall update application and post statuses when an
    application is approved.
-   The system shall prevent users from applying to their own posts.
-   The system shall allow users to view the statuses of applications
    they submitted and applications received on their posts.

### FR-5: Private Messaging

-   The system shall allow authenticated users to start or open a
    private conversation related to a support request or offer.
-   The system shall allow conversation participants to send and view
    text messages.
-   The system shall preserve conversation history so participants can
    review previous messages.
-   The system shall allow messaging before an application is submitted
    or approved.
-   The system shall restrict access to each conversation and its
    messages to the conversation participants.
-   The system shall not treat sending a message as submitting an
    application or approving a support arrangement.
-   The system shall provide understandable feedback when a message
    cannot be sent or loaded.

## 7. Non-Functional Requirements

### 7.1 Usability

-   The interface shall be simple and understandable for users with
    different levels of technical experience.
-   Navigation shall clearly distinguish support requests from support
    offers.
-   Forms shall provide clear validation messages.
-   The application shall provide feedback when an operation succeeds or
    fails.
-   Messaging controls shall clearly identify the conversation and its
    participants.

### 7.2 Security

-   Authentication shall be handled through an appropriate
    authentication provider.
-   Users shall only be able to modify content they are authorized to
    manage.
-   Database access rules shall protect private user information and
    prevent unauthorized changes.
-   Conversation records and messages shall be accessible only to their
    participants.
-   Sensitive authentication information shall not be stored directly in
    application code.
-   The application shall use HTTPS when deployed.

### 7.3 Reliability

-   The application shall validate user input before saving data.
-   Failed operations shall provide understandable error messages.
-   The application shall handle missing or unavailable data gracefully.
-   Messages shall be stored persistently so that conversation history
    is available when users return.

### 7.4 Maintainability

-   Features shall be organized into understandable modules.
-   Components and data models shall be reusable where appropriate.
-   The codebase shall follow consistent naming and formatting
    conventions.
-   Project documentation shall describe the application's main features
    and setup process.

### 7.5 Responsive Design

-   The application shall support desktop and mobile browser layouts.
-   Forms, navigation, post details, and messaging screens shall remain
    usable on smaller screens.

## 8. Data Model

The MVP will use a small set of related data entities. The final
database schema may be refined during implementation, provided that it
supports the requirements in this specification.

### 8.1 User

  Field          Description
  -------------- -------------------------------
  id             Unique user identifier
  display_name   User's display name
  role           New Mom or Senior Mom
  location       General location
  bio            Optional profile introduction
  created_at     Account creation timestamp

Authentication credentials will be managed by the authentication
provider rather than stored directly in the User profile table.

### 8.2 SupportPost

Support requests and offers will share a common post structure.

  Field            Description
  ---------------- ---------------------------------------------
  id               Unique post identifier
  creator_id       ID of the user who created the post
  post_type        Request or Offer
  title            Post title
  description      Details of the requested or offered support
  location         General location
  preferred_date   Optional requested or available date
  start_time       Optional start time
  end_time         Optional end time
  status           Open, Matched, Completed, or Cancelled
  created_at       Post creation timestamp
  updated_at       Last update timestamp

Some fields may be optional depending on the post type.

### 8.3 Application

  Field          Description
  -------------- ----------------------------------
  id             Unique application identifier
  post_id        ID of the related support post
  applicant_id   ID of the user applying
  status         Pending, Approved, or Rejected
  created_at     Application submission timestamp
  updated_at     Last update timestamp

An application belongs to one support post and one applicant. The
database will enforce appropriate relationships and prevent invalid
applications, such as applying to one's own post.

### 8.4 Conversation

  -----------------------------------------------------------------------
  Field                               Description
  ----------------------------------- -----------------------------------
  id                                  Unique conversation identifier

  post_id                             ID of the related support request
                                      or offer, when applicable

  created_at                          Conversation creation timestamp

  updated_at                          Timestamp of the latest
                                      conversation activity
  -----------------------------------------------------------------------

A conversation will have a defined set of participants. Access rules
must ensure that only those participants can view the conversation.

### 8.5 ConversationParticipant

  Field             Description
  ----------------- ----------------------------------------------
  conversation_id   ID of the conversation
  user_id           ID of a participating user
  joined_at         Timestamp when the user became a participant

The conversation-participant relationship will be used to check access
to a conversation and its messages.

### 8.6 Message

  Field             Description
  ----------------- -------------------------------------
  id                Unique message identifier
  conversation_id   ID of the conversation
  sender_id         ID of the user who sent the message
  body              Text content of the message
  created_at        Message creation timestamp

Each message belongs to one conversation and has one sender. Database
access rules must prevent non-participants from reading or sending
messages in that conversation.

## 9. User Interface and Main Pages

The MVP will include the following pages or screens.

### 9.1 Home Page

-   Introduces MomConnect.
-   Explains the purpose of the application.
-   Provides links to register, sign in, and browse available support
    where permitted.

### 9.2 Registration and Login Pages

-   Provide email/password authentication.
-   Provide Google and Facebook sign-in options.
-   Allow new users to select their role during registration.

### 9.3 Basic Profile View

-   Displays basic user information, such as display name, role, general
    location, and optional introduction.
-   Allows users to update their own basic profile information where
    implemented.
-   Does not display exact home addresses or claim that users are
    verified.

### 9.4 Support Listings Page

-   Displays available support requests or offers.
-   Allows users to open individual post details.
-   Provides basic navigation between requests and offers.

### 9.5 Post Details Page

-   Displays the selected request or offer.
-   Shows relevant creator information.
-   Provides an application action when the current user is eligible.
-   Provides a way to start or open a private conversation about the
    post.

### 9.6 Create and Edit Post Pages

-   Provide forms for creating and editing requests or offers.
-   Display validation messages.
-   Allow authorized users to manage their own posts.

### 9.7 Application Management Page

-   Displays applications submitted to the user's posts.
-   Allows the post creator to approve or reject applications.
-   Displays application status.

### 9.8 My Page

-   Displays the user's support requests, support offers, and relevant
    applications.
-   Shows current post and application statuses.
-   Provides links to relevant management screens and conversations.

### 9.9 Private Messaging Pages

-   Display a user's private conversations.
-   Display the message history for a selected conversation.
-   Allow conversation participants to send text messages.
-   Clearly identify the conversation context and participants.
-   Restrict conversation content to its participants.

The interface will prioritize essential workflows over visual
complexity.

## 10. Technical Approach

The project will use a conventional web application architecture.

The exact implementation technologies will be confirmed during project
planning.

Potential technologies include:

-   **Frontend:** React
-   **Authentication and database service:** Supabase
-   **Database:** PostgreSQL
-   **Version control:** Git and GitHub

Supabase is a potential choice because it provides authentication and a
relational database in one service. This may simplify implementation for
a student team.

Google and Facebook authentication will require appropriate provider
configuration. Private messaging will require database tables and access
policies for conversations, participants, and messages.

The team will confirm the final technology stack before implementation
begins.

## 11. Out of Scope

The following features will not be included in the initial MVP:

-   Push notifications or email notifications for new messages or
    applications
-   Ratings, reviews, and reputation scores
-   Identity verification and background checks
-   Payment processing or paid support services
-   AI-based matching or recommendations
-   Advanced search and filtering
-   Calendar synchronization
-   Automated scheduling
-   Multiple concurrent support arrangements with complex conflict
    resolution
-   Administrative moderation dashboards
-   Detailed analytics and reporting
-   File attachments in messages
-   Voice or video calls
-   Read receipts and advanced messaging features
-   Sophisticated notification preferences

These features may be considered in future versions if the core
application is completed successfully and the team has sufficient time.

The MVP will not claim that users have been verified or that a
conversation, application, or match guarantees the safety of either
participant.

## 12. Privacy and Safety Considerations

MomConnect connects people who may not know each other. The application
should therefore minimize unnecessary exposure of personal information.

The MVP will follow these principles:

-   Users will provide only the profile information necessary for the
    intended purpose.
-   General location information will be preferred over displaying exact
    home addresses.
-   Users will not be required to publish sensitive personal
    information.
-   Database access rules will restrict unauthorized access to private
    records.
-   Private conversations and messages will be accessible only to their
    participants.
-   Users will be able to cancel their own support posts.
-   The application will clearly state that it facilitates connections
    but does not independently verify users.
-   The application will focus on non-medical parenting support and will
    not provide medical advice.
-   Users should avoid sharing sensitive personal information in
    messages.

The application will not implement background checks or formal identity
verification in the MVP. Private messaging allows users to communicate
and discuss expectations, but it is not a safety verification system.
These limitations will be communicated clearly.

## 13. Acceptance Criteria

The MVP will be considered functionally complete when the following
conditions are met.

### Authentication

-   A new user can register and sign in.
-   Google and Facebook authentication can be used after the relevant
    providers are configured.
-   The system records the user's selected role.
-   Protected actions require authentication.

### Support Requests

-   A New Mom can create a support request.
-   Users can browse available support requests.
-   Users can edit and delete their own requests.
-   Required fields are validated.

### Support Offers

-   A Senior Mom can create a support offer.
-   Users can browse available support offers.
-   Users can edit and delete their own offers.
-   Required fields are validated.

### Applications and Matching

-   A Senior Mom can apply to a New Mom's support request.
-   A New Mom can apply to a Senior Mom's support offer.
-   A post creator can approve or reject applications to their own post.
-   An approved application updates the relevant post status.
-   Unauthorized users cannot approve or reject applications they do not
    manage.
-   Users can view the statuses of their own relevant applications.

### Private Messaging

-   An authenticated user can start or open a private conversation about
    a support request or offer.
-   Participants can send and view text messages.
-   Conversation history remains available when participants return.
-   Users can message before submitting an application or before an
    application is approved.
-   Users who are not participants cannot view the conversation or its
    messages.
-   Sending a message does not automatically submit or approve an
    application.
-   The application provides appropriate feedback for successful and
    unsuccessful message operations.

### General Quality

-   Main pages work in desktop and mobile browser layouts.
-   Invalid form submissions are handled appropriately.
-   Database permissions protect user data and prevent unauthorized
    modifications.
-   The application can be run using the documented setup instructions.

## 14. Development Priorities

Development will proceed in a dependency-aware order.

1.  **F1 --- User Authentication:** Establish user identity and
    authentication.
2.  **F2 --- Create Support Request:** Implement creation and management
    of New Mom support requests.
3.  **F3 --- Create Support Offer:** Implement creation and management
    of Senior Mom support offers.
4.  **F4 --- Apply for Support:** Implement browsing, applications,
    approval/rejection, and relevant status updates.
5.  **F5 --- Private Messaging:** Implement private conversations and
    text-message history, including communication before application or
    approval.

The feature plans should be maintained separately and aligned with these
five feature groups. Some tasks may be developed in parallel after the
underlying data model and interfaces are agreed upon.

The team should test each feature before integrating it into the main
application.

## 15. Future Enhancements

After the MVP is completed, the team may consider:

-   Email or in-app notifications
-   Ratings and reviews
-   More advanced search and filtering
-   Calendar integration
-   Improved scheduling and availability management
-   Additional safety and moderation features
-   Message attachments, read receipts, or voice/video communication

These enhancements are not commitments for the initial release. They
will be considered according to user needs, project time, and team
capacity.

## 16. Success Criteria

The project will be successful if it demonstrates a complete,
understandable workflow for connecting mothers who need support with
mothers who can provide it.

Specifically, users should be able to:

1.  Register and sign in.
2.  Publish a support request or support offer according to their role.
3.  Discover a relevant request or offer.
4.  Privately discuss support details with another user before applying.
5.  Apply to a post.
6.  Have the post creator approve or reject the application.
7.  View the resulting application and post status.

The project should also demonstrate that the team can use a written
specification to guide implementation, divide work into manageable
features, and test the resulting application against defined
requirements.

## 17. Conclusion

MomConnect aims to make it easier for mothers to find and offer
practical, non-medical parenting support.

By supporting both New Mom requests and Senior Mom offers, the
application allows users to participate in either side of the support
process according to their needs and role. Private messaging gives users
a way to ask questions and discuss details before deciding whether to
apply, while the application and approval workflow records the decision
about a proposed support arrangement.

The MVP focuses on five main feature groups: user authentication,
creating support requests, creating support offers, applying for
support, and private messaging.

Advanced features are intentionally excluded so that the team can
concentrate on implementing a coherent, usable application within the
available project timeframe.

This specification defines the planned scope of the MVP. Specific
implementation details may be refined during development, provided that
changes remain consistent with the project's goals and agreed
requirements.
