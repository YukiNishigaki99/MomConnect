# MomConnect — Feature Inventory List

## Project Overview

MomConnect is a community support platform that connects new mothers with experienced mothers who can provide practical help and support.

Users can request support, offer support, apply for support opportunities, and communicate privately before deciding whether to move forward.

## MVP Features

The following features are included in the Minimum Viable Product (MVP).

| Feature ID | Feature Name | Description | Type | Priority |
|---|---|---|---|---|
| F1 | User Authentication | Allow users to register and sign in using supported authentication providers. | Infrastructure/Supporting | Must Have |
| F2 | Create Support Request | Allow new mothers to create and manage posts describing the support they need. | Blocked by F1 | Must Have |
| F3 | Create Support Offer | Allow experienced mothers to create and manage posts describing the support they can provide. | Blocked by F1 | Must Have |
| F4 | Apply for Support | Allow users to browse support requests and offers, apply for suitable opportunities, and allow post creators to approve or reject applications. | Blocked by F2 and F3 | Must Have |
| F5 | Private Messaging | Allow authenticated users to communicate privately about support requests and offers before deciding whether to proceed. | Blocked by F1, F2, and F3 | Must Have |

## Feature Details

### F1 — User Authentication
- Allow users to register and sign in.
- Support selected authentication providers.
- Associate user activities with the correct account.

### F2 — Create Support Request
- Allow new mothers to describe the help they need.
- Allow users to view available support requests.
- Allow request creators to manage their own posts.

### F3 — Create Support Offer
- Allow experienced mothers to describe the support they can provide.
- Allow users to view available support offers.
- Allow offer creators to manage their own posts.

### F4 — Apply for Support
- Allow experienced mothers to apply for support requests.
- Allow new mothers to apply for support offers.
- Allow post creators to approve or reject applications.
- Display application statuses to the relevant users.

### F5 — Private Messaging
- Allow users to send private text messages.
- Allow users to view their conversation history.
- Allow users to discuss support needs, experiences, expectations, and arrangements.
- Support communication before an application is submitted or approved.
- Restrict conversations to their intended participants.

Private messaging helps users learn more about one another before arranging support. However, conversations alone cannot verify a person's identity or guarantee their trustworthiness.

## MVP User Flows

### Flow 1: Requesting Support

1. A new mother signs in.
2. She creates a support request.
3. An experienced mother discovers the request.
4. They can communicate privately to discuss the request.
5. The experienced mother applies for the request.
6. The new mother approves or rejects the application.

### Flow 2: Offering Support

1. An experienced mother signs in.
2. She creates a support offer.
3. A new mother discovers the offer.
4. They can communicate privately to discuss the support.
5. The new mother applies for the offer.
6. The experienced mother approves or rejects the application.

## Implementation Dependencies

The planned implementation order is:

1. **F1 — User Authentication:** Establish user accounts and authentication.
2. **F2 — Create Support Request:** Implement support request creation and management.
3. **F3 — Create Support Offer:** Implement support offer creation and management.
4. **F4 — Apply for Support:** Implement applications and application decisions.
5. **F5 — Private Messaging:** Implement private conversations associated with support requests and offers.

F2 and F3 both depend on authentication. F4 requires support requests and offers to exist. F5 requires authenticated users and a way to associate conversations with relevant support requests or offers.

**Important:** F5 must support communication before application approval. Therefore, private messaging should not depend on a completed match or an approved application.

## Out of Scope for the MVP

The following features are not included in the current MVP:

- Payment processing.
- AI-powered matching.
- Advanced recommendation algorithms.
- User reviews and ratings.
- Video and voice calling.
- Automated identity verification.
- Advanced notification preferences.

These features may be considered for future development.

## MVP Success Criteria

The MVP should allow users to:

- Register and sign in.
- Create and discover support requests.
- Create and discover support offers.
- Apply for support and approve or reject applications.
- Communicate privately before deciding whether to proceed.

The MVP is complete when these core user flows work as intended and users can participate in both requesting and offering support.