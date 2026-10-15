Event Discovery & Community Engagement Platform

A web-based event discovery and community engagement platform using Next.js 16, React, Tailwind CSS, Strapi 5, PostgreSQL or MySQL, NextAuth JWT authentication, and Leaflet.js. The platform allows visitors to discover events, search and filter events, view event details and locations, while registered users can RSVP, save events, submit reviews, and propose new events. Administrators manage events, categories, users, featured events, and submitted content.

The functional requirements below are implemented for the Next.js and Strapi technology stack.

Functional Requirements
FR-01: Interactive Event Map
Display events on an interactive map using Leaflet.js.
Show each event as a map marker.
Use different marker icons or styles for event categories.
Allow users to zoom and pan the map.
Automatically display relevant events within the map area.
Clicking a marker displays basic event information.
Selecting an event from the list highlights its map marker and centers the map on that location.
FR-02: Event List View
Display all available events in a responsive Tailwind CSS card/list layout.
Show:
Event name
Category
Event image
Date and time
Short description
Location
Provide pagination for large numbers of events.
Synchronize the event list with the map.
Selecting an event from the list highlights the corresponding map marker.
FR-03: Category-Based Filtering

Users can filter events by categories such as:

Music
Sports
Technology
Art & Culture
Food & Drink
Health & Wellness
Community Service

The event list and map markers should update according to the selected category.

FR-04: Event Detail Page

Each event has a dedicated detail page containing:

Event name
Category
Full description
Event images
Venue name
Complete address
Date
Start/end time
Ticket price
Organizer information
Contact information
Event location map
Registration/RSVP option for logged-in users

A unique event ID or slug is used to access each event.

FR-05: Event Images and Descriptions
Admin can upload event images.
Multiple images can be associated with an event.
Display images using a Tailwind CSS carousel/gallery.
Show a short description on event cards.
Show the complete description on the event detail page.
Provide appropriate image alternative text.
FR-06: Map Marker Highlighting

When a user selects an event:

Highlight its corresponding map marker.
Center the map on the event.
Display an information popup.
Show event name, category, date, and location in the popup.
Keep the selected event synchronized between the list and map.
FR-07: Featured Events
Display a Featured Events section on the homepage.
Admin can mark/unmark events as featured.
Featured event cards display:
Image
Event name
Category
Date
Short description
View Details button
Display featured events using a responsive Tailwind CSS grid or carousel.
FR-08: Event Search

Provide a search bar allowing users to search by:

Event name
Category
Organizer
Venue
Location keywords

Search results should update the event list and map. A clear/reset option should restore the default event listing. If no matching event exists, display a "No Results Found" message.

FR-09: Address and Basic Event Information

Every event should display:

Venue name
Street/address
City
Region
Date
Time
Category
Ticket price or Free
Organizer name
Organizer contact

A Get Directions option can open the location in a mapping service.

FR-10: Responsive Interface

The website must work properly on:

Desktop
Laptop
Tablet
Mobile

Tailwind CSS will be used to provide:

Responsive navigation
Responsive event cards
Responsive forms
Mobile-friendly filters
Responsive map/list layout
Touch-friendly buttons and controls.
Additional Functional Requirements
FR-11: User Registration

Users can create accounts by providing:

Name
Email
Password
Profile information

The Strapi Users & Permissions plugin validates registration data and stores accounts in PostgreSQL or MySQL.

FR-12: User Login and Logout
Registered users can log in.
NextAuth manages signed sessions and uses Strapi JWTs for protected API requests.
Users can log out securely.
Unauthorized users cannot access protected features.
FR-13: Role-Based Access Control

The system provides three primary roles:

Guest

Browse events
Search and filter
View event details
View featured events

Registered User

All guest functionality
RSVP/register for events
Save favorites
Submit reviews
Manage profile
Submit events for approval

Administrator

Manage users
Manage events
Manage categories
Manage event images
Approve/reject submitted events
Manage featured events.
FR-14: Event RSVP/Registration

Authenticated users can:

Register for an event.
View registration status.
Cancel their registration where permitted.
Prevent duplicate registrations.
View their registered events.
Receive an on-screen confirmation.
FR-15: Favorite/Bookmark Events

Registered users can:

Add events to favorites.
Remove events from favorites.
View their saved events from their profile.
FR-16: Reviews and Ratings

Authenticated users can:

Submit a review for an event.
Give a rating.
View existing reviews.
Edit/delete their own review where permitted.

The system should prevent unauthorized users from modifying other users' reviews.

FR-17: Event Submission

Registered users can submit new events containing:

Event name
Category
Description
Images
Venue
Address
Date/time
Ticket information
Organizer information

Submitted events remain pending until reviewed by an administrator.

FR-18: Event Approval

Administrators can:

View pending events.
Approve events.
Reject events.
Edit submitted information.
Publish approved events.

Only approved/published events should appear publicly.

FR-19: User Profile

Registered users can:

View profile information.
Update their name and contact information.
Change password.
Upload/update profile image.
View RSVP history.
View favorite events.
View submitted events.
View submitted reviews.
FR-20: Category Management

Administrators can:

Add categories.
Edit categories.
Delete categories.
View events associated with a category.
Prevent deletion where existing events depend on a category, or require reassignment.
FR-21: Event Management

Administrators can perform complete CRUD operations:

Create events
View events
Edit events
Delete events
Upload/manage images
Assign categories
Set featured status
Publish/unpublish events

The original proposal specifically requires administrators to have full CRUD access to events and event content.

FR-22: User Management

Administrators can:

View registered users.
Search users.
Activate/deactivate accounts.
Delete users where appropriate.
View user activity and registrations.
Manage user roles.
FR-23: Admin Dashboard

The administrator dashboard should provide an overview of:

Total users
Total events
Pending events
Approved events
Featured events
Total RSVPs
Categories
Reviews
FR-24: Event Date and Location Filtering

Users can filter events according to:

Upcoming events
Past events
Specific date
Date range
Category
Location
FR-25: Event Status Management

Events can have statuses such as:

Pending
Approved
Rejected
Published
Unpublished
Completed

This allows administrators to control event visibility and lifecycle.

FR-26: Event Organizer Information

Each event should contain organizer details such as:

Organizer name
Email
Phone/contact
Organization name where applicable
FR-27: Navigation and User Experience

The system should provide:

Homepage
Events page
Event detail page
Search
Categories
Login
Registration
User profile
Favorites
My RSVPs
Admin dashboard
FR-28: Database Management

Strapi content types backed by PostgreSQL or MySQL store and manage:

Users
Roles
Events
Categories
Event images
RSVPs
Favorites
Reviews
Event submissions
Locations
FR-29: Security and Validation

The Next.js application and Strapi API should provide:

Server-side form validation
Client-side validation
Password hashing
Session-based authentication
Role-based authorization
SQL injection protection using prepared statements
Input sanitization
Access control for admin pages
FR-30: Event Data Synchronization

The event listing, search results, filters, featured events, and map use the same Strapi event data so administrator changes appear throughout the site.

Technology Stack
Layer	Technology
Frontend	Next.js 16+ / React
Styling	Tailwind CSS with the preserved EventDiscovery design system
State Management	React Context API
UI Components	Reusable accessible components styled with Tailwind
Authentication	NextAuth.js credentials provider + Strapi JWT
CMS	Strapi 5
Database	PostgreSQL or MySQL
File Storage	Cloudinary
API	REST and GraphQL
Map	Leaflet.js
Deployment	Vercel / Netlify and Railway / DigitalOcean / AWS
