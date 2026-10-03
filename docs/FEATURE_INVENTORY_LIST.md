# MomConnect — Feature Inventory List

## Overview

This document lists the core features included in the MomConnect MVP and links to their individual implementation plans.

## Feature Inventory

| Feature ID | Feature Name | Description | Priority | Feature Plan |
|---|---|---|---|---|
| F1 | User Authentication | Register, log in, and access the application securely. | Must-have | [F1 Plan](plans/F1-user-authentication.md) |
| F2 | User Profile Management | Create and manage user profiles, including basic information and municipality. | Must-have | [F2 Plan](plans/F2-user-profile-management.md) |
| F3 | Support Board | Create, browse, and filter support requests and offers. | Must-have | [F3 Plan](plans/F3-support-board.md) |
| F4 | Application & Matching | Apply to support requests and allow request creators to approve or reject applications. | Must-have | [F4 Plan](plans/F4-application-and-matching-management.md) |
| F5 | Direct Messaging | Enable private one-to-one messaging between users after an application is approved. | Must-have | [F5 Plan](plans/F5-private-messaging.md) |
| F6 | Request Lifecycle & History | Manage request statuses, including completion and cancellation, and maintain request history. | Must-have | [F6 Plan](plans/F6-request-lifecycle-and-history.md) |

## Dependencies

- F1 is required before most other features can be used.
- F2 and F3 provide the user and support-post information needed for matching.
- F4 depends on F1 and F3.
- F5 depends on F4 because private conversations are available after an application is approved.
- F6 depends on F3 and F4 to manage request statuses and history.

## Scope

The MVP focuses on the core support workflow: creating support posts, applying for support, approving applicants, communicating privately, and managing request status and history.

Additional features outside this scope can be considered for future development.