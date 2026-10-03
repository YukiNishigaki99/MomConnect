# Project Specification: MomConnect (Refined Draft)

## 1. Project Overview
- **Project Name:** MomConnect (Community Childcare Support & Matching App)
- **Objective:** Connect solo-parenting mothers with experienced "senior moms" in the local community for short-term childcare support through a mutual support bulletin board.

## 2. Target Users
1. **Requester Mom (User):** Mothers raising young children who need temporary, non-medical support.
2. **Senior Mom (Supporter):** Experienced mothers with time and willingness to help local parents.
3. **Administrator (Admin):** Moderates listings and manages demo seed data.

## 3. MVP Features (Minimum Viable Product)
- **User Authentication & Role Setup:** Register, log in, and select role (`Requester Mom` / `Senior Mom`).
- **User Profile Management:** Set location (municipality), bio, and view other users' profiles.
- **Support Board (Requests & Offers):** Create, browse, and filter posts by municipality and post type (`Need Help` / `Can Help`).
- **Application & Matching Workflow:** Apply to a post, review applicants, and approve to create a match.
- **Private Messaging:** Private chat thread unlocked for matched pairs to finalize details.
- **Request Lifecycle & History:** Track status (`Open` → `Matched` → `Completed`) and view activity history in My Page.

## 4. Future / Optional Features (Out of Scope for MVP)
- Two-way star rating and review system
- Government ID verification (KYC)
- Push / Browser notifications
- Advanced map/radius search

## 5. Basic User Flow
1. **Post:** A user creates a post (`Need Help` or `Can Help`) with date, area, and details.
2. **Apply:** Another user browses the board and submits an application.
3. **Approve:** The post owner accepts an applicant, updating status to `Matched`.
4. **Coordinate:** A private 1-on-1 chat opens for scheduling and details.
5. **Complete:** After support is provided, the post owner marks it as `Completed`.

## 6. Initial Data Models
- **Users:** `id`, `name`, `email`, `role` (`requester`/`supporter`), `area_id`, `bio`
- **Posts:** `id`, `user_id`, `post_type` (`need_help`/`can_help`), `title`, `description`, `event_date`, `area_id`, `status` (`open`/`matched`/`completed`/`cancelled`)
- **Applications:** `id`, `post_id`, `applicant_id`, `status` (`pending`/`accepted`/`rejected`)
- **Messages:** `id`, `post_id`, `sender_id`, `content`, `created_at`

## 7. Key Screens / Views
1. Login & Registration View
2. Support Board (Main Feed): Filterable by Municipality and Post Type (`Need Help` / `Can Help`)
3. Create Post View: Form with type selection, title, description, date, and area
4. Post Detail & Applicant Management View
5. 1-on-1 Messaging View
6. My Page / Activity Dashboard

## 8. Essential API Interactions
- `POST /api/register`, `POST /api/login`
- `GET /api/posts` (query params: `area_id`, `post_type`), `POST /api/posts`, `GET /api/posts/:id`
- `POST /api/posts/:id/applications`, `PATCH /api/applications/:id`
- `GET /api/posts/:id/messages`, `POST /api/posts/:id/messages`
- `PATCH /api/posts/:id/status`