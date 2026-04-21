# Backend API Guide for Frontend Developers

This note describes the backend API contract used by the Smart Campus frontend. It focuses on the response envelope, request payloads, query parameters, error handling, and the endpoint patterns that appear across the app.

## Base Conventions

- Base path for application APIs: `/api`
- Most list and detail endpoints return JSON wrapped in `ApiResponse<T>`
- Most state-changing endpoints return `201 Created`, `200 OK`, or `204 No Content`
- Most write operations use `Cache-Control: no-store`
- Most list and detail read operations use `Cache-Control: public, max-age=300` or `no-store` depending on the module
- Authentication is enforced on protected routes through the bearer token / JWT provided by the frontend

## Standard Response Shape

Most endpoints use this envelope:

```json
{
  "status": "success",
  "data": {},
  "error": null,
  "_links": {
    "self": { "href": "/api/..." }
  }
}
```

When a request fails, the backend returns:

```json
{
  "status": "error",
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found: res_room_01"
  },
  "_links": {}
}
```

Frontend code should always check `status` first, then read `data` on success or `error.code` and `error.message` on failure.

## Resource API

### GET `/api/resources`

Lists resources with optional filtering and pagination.

Query parameters:

- `search` - optional text search on resource name
- `type` - optional filter, one of `ROOM`, `LAB`, `EQUIPMENT`
- `status` - optional filter, one of `ACTIVE`, `OUT_OF_SERVICE`
- `minCapacity` - optional minimum capacity
- `page` - 1-based page number, default `1`
- `limit` - items per page, default `10`

Response data:

```json
{
  "items": [
    {
      "id": "res_room_01",
      "name": "Main Lecture Hall A",
      "type": "ROOM",
      "capacity": 150,
      "location": "Building 1, Floor 2",
      "status": "ACTIVE",
      "imageUrl": "resources/sample_main_lecture_hall_a.jpg",
      "_links": {
        "self": { "href": "/api/resources/res_room_01" }
      }
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

Important note: `imageUrl` is part of both the list and detail resource payloads. Frontend code can render it directly without an extra lookup.

### GET `/api/resources/{id}`

Returns a single resource with full details.

Useful fields:

- `id`
- `name`
- `type`
- `capacity`
- `location`
- `status`
- `description`
- `imageUrl`
- `availabilityWindows`
- `createdAt`

### POST `/api/resources`

Creates a resource.

Request body example:

```json
{
  "name": "Main Lecture Hall A",
  "type": "ROOM",
  "capacity": 150,
  "location": "Building 1, Floor 2",
  "status": "ACTIVE",
  "description": "High-tech lecture room with 2 projectors.",
  "imageUrl": "resources/sample_main_lecture_hall_a.jpg"
}
```

The backend may also accept `availabilityWindows` for initial setup.

### PUT `/api/resources/{id}`

Updates an existing resource. All fields are optional and are applied as a partial update.

### DELETE `/api/resources/{id}`

Deletes a resource. On success, the endpoint returns `204 No Content`.

## Booking API

### GET `/api/bookings`

Query parameters:

- `status` - optional booking status filter
- `resourceId` - optional resource filter
- `userId` - optional user filter
- `page` - default `1`
- `limit` - default `10`

Use this endpoint when showing booking lists or booking history tables.

### GET `/api/bookings/me`

Same filtering as the list endpoint, but the backend derives the user from the JWT subject. The frontend should not pass another user id here.

### POST `/api/bookings`

Creates a booking request. The backend validates:

- authenticated user identity
- booking conflicts
- resource availability windows
- status and time constraints

### GET `/api/bookings/{id}`

Returns booking details. The backend enforces access control so non-admin users can only read their own bookings.

## Ticket API

### GET `/api/tickets`

Query parameters:

- `status` - optional ticket status filter
- `createdBy` - optional owner filter
- `assignedTo` - optional technician filter
- `resourceId` - optional resource filter
- `page` - default `1`
- `limit` - default `10`

### GET `/api/tickets/me`

Same as the list endpoint, but the backend derives the user from the JWT subject.

### POST `/api/tickets`

Creates a maintenance ticket. Attachments are typically uploaded first, then referenced by file name in the request.

### GET `/api/tickets/{id}`

Returns ticket details, including nested comments and attachments.

## Notifications API

### GET `/api/notifications`

Query parameter:

- `read` - optional boolean filter
  - `true` returns read notifications
  - `false` returns unread notifications
  - omitted returns all notifications

The list response includes `items` inside `data`. Notification items contain their own `_links` field.

### GET `/api/notifications/{id}`

Returns a single notification for the authenticated user.

### PATCH `/api/notifications/{id}/read`

Marks one notification as read.

### PATCH `/api/notifications/read-all`

Marks all notifications as read.

## Error Handling Guide

Use the following response codes as the main frontend branches:

- `400 Bad Request` - validation or query parameter error
- `401 Unauthorized` - missing or invalid bearer token
- `403 Forbidden` - authenticated, but not allowed to access the resource
- `404 Not Found` - entity does not exist or is not accessible
- `409 Conflict` - booking collision or similar business rule conflict
- `500 Internal Server Error` - unexpected backend failure

Common backend error codes include:

- `RESOURCE_VALIDATION_ERROR`
- `RESOURCE_QUERY_VALIDATION_ERROR`
- `RESOURCE_NOT_FOUND`
- `BOOKING_VALIDATION_ERROR`
- `BOOKING_QUERY_VALIDATION_ERROR`
- `BOOKING_CONFLICT`
- `BOOKING_NOT_FOUND`
- `TICKET_VALIDATION_ERROR`
- `TICKET_QUERY_VALIDATION_ERROR`
- `TICKET_NOT_FOUND`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `INTERNAL_ERROR`

## Frontend Handling Notes

- Always guard against `data` being `null` when `status` is `error`
- Prefer reading the backend `_links` when you need navigation targets between related resources
- For list pages, keep query state in the URL so pagination and filters remain shareable
- For resource cards and detail pages, use `imageUrl` directly from the backend instead of hardcoding image paths
- When a request fails with `401`, redirect the user back through the login flow or refresh the session

## Practical Example

For a resource list page, the frontend should typically:

1. Send `GET /api/resources?search=lab&type=LAB&page=1&limit=10`
2. Read `response.data.items`
3. Render each item using `name`, `capacity`, `location`, `status`, and `imageUrl`
4. Use `response._links.next` and `response._links.prev` for pagination buttons

This document should be kept in sync with the controller and DTO classes whenever the backend contract changes.