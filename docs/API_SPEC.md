# API Specification — NovaOS

> Planned API contracts for all backend endpoints. Not yet implemented — serves as the source of truth for future backend development.

---

## 1. Base Configuration

| Property | Value |
|----------|-------|
| Base URL | `/api/v1` |
| Auth | Bearer JWT (future) |
| Content Type | `application/json` |
| Error Format | `{ error: string, code: string, details?: any }` |

---

## 2. Authentication

### POST /api/v1/auth/login

```
Request:
{
  "email": "sumith@novatech.com",
  "password": "••••••••"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr_001",
    "name": "Sumith Kumar",
    "email": "sumith@novatech.com",
    "avatar": null,
    "role": "admin"
  }
}

Response 401:
{
  "error": "Invalid credentials",
  "code": "AUTH_INVALID"
}
```

### POST /api/v1/auth/logout

```
Headers: Authorization: Bearer <token>

Response 200: { "success": true }
```

---

## 3. Dashboard

### GET /api/v1/dashboard/summary

Returns all dashboard data in a single request.

```
Headers: Authorization: Bearer <token>

Response 200:
{
  "company": {
    "name": "NovaTech Solutions",
    "employees": 48,
    "founded": "2021"
  },
  "commandCenter": {
    "greeting": "Good Morning, Sumith",
    "revenue": "$82,450",
    "revenueChange": "+14%",
    "ordersToday": 47,
    "inventoryAlerts": 3,
    "pendingApprovals": 2,
    "aiSummary": "Revenue is up 14%...",
    "recommendation": "Approve pending leave requests..."
  },
  "kpis": [
    { "label": "Total Revenue", "value": "$82,450", "change": 14, "changeLabel": "vs last month", "icon": "revenue" }
  ],
  "health": {
    "financial": { "score": 87, "trend": "up", "label": "Financial Health", "description": "..." },
    "operational": { "score": 78, "trend": "up", "label": "Operational Health", "description": "..." },
    "employee": { "score": 92, "trend": "up", "label": "Employee Productivity", "description": "..." }
  },
  "quickActions": [
    { "id": "1", "label": "Generate Report", "icon": "file-text", "description": "Monthly business summary" }
  ],
  "schedule": [
    { "id": "1", "title": "Team Standup", "time": "9:00 AM - 9:30 AM" }
  ],
  "tasks": [
    { "id": "1", "title": "Review leave requests", "due": "Today", "priority": "high" }
  ],
  "notifications": [
    { "id": "1", "message": "Priya Sharma submitted leave", "time": "10 min ago" }
  ]
}
```

### GET /api/v1/dashboard/revenue

```
Query: ?months=12

Response 200:
{
  "data": [
    { "month": "Jan", "revenue": 38500, "forecast": 36000 }
  ],
  "summary": {
    "total": 624450,
    "growth": 14,
    "bestMonth": "December",
    "bestValue": 82450
  }
}
```

### GET /api/v1/dashboard/orders

```
Query: ?months=12

Response 200:
{
  "data": [
    { "month": "Jan", "orders": 28 }
  ],
  "summary": {
    "total": 465,
    "growth": 8.2,
    "averageOrderValue": 1754
  }
}
```

### GET /api/v1/dashboard/activities

```
Query: ?limit=10

Response 200:
{
  "data": [
    {
      "id": "act_001",
      "type": "workflow",
      "message": "Leave request submitted by Priya Sharma",
      "timestamp": "2026-07-04T09:30:00Z",
      "user": "Priya Sharma"
    }
  ]
}
```

---

## 4. AI Copilot

### POST /api/v1/copilot/chat

```
Headers: Authorization: Bearer <token>

Request:
{
  "message": "Generate monthly report for June",
  "conversationId": "conv_001",   // null for new conversation
  "context": {
    "includeRevenue": true,
    "includeInventory": true,
    "includeWorkflows": true
  }
}

Response 200:
{
  "conversationId": "conv_001",
  "reply": "Here's your **Monthly Business Report**...",
  "sources": ["revenue_summary", "inventory_alerts"],
  "suggestions": [
    "Would you like me to generate a PDF?",
    "Should I dive into inventory details?"
  ]
}

Response (streaming — future):
Content-Type: text/event-stream

data: {"type": "text", "content": "Here's your "}
data: {"type": "text", "content": "**Monthly Business Report**"}
data: {"type": "done"}
```

### GET /api/v1/copilot/conversations

```
Response 200:
{
  "data": [
    {
      "id": "conv_001",
      "title": "Monthly Business Report",
      "lastMessage": "Generated June 2026 report with AI insights",
      "updatedAt": "2026-07-04T10:00:00Z",
      "isFavorite": true,
      "messageCount": 4
    }
  ]
}
```

### GET /api/v1/copilot/conversations/:id

```
Response 200:
{
  "id": "conv_001",
  "title": "Monthly Business Report",
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "Generate monthly report for June",
      "timestamp": "2026-07-04T09:55:00Z"
    },
    {
      "id": "msg_002",
      "role": "assistant",
      "content": "Here's your **Monthly Business Report**...",
      "timestamp": "2026-07-04T09:55:03Z"
    }
  ]
}
```

### PATCH /api/v1/copilot/conversations/:id

```
Request:
{
  "title": "Updated Title",
  "isFavorite": true
}

Response 200: { "success": true }
```

### DELETE /api/v1/copilot/conversations/:id

```
Response 200: { "success": true }
```

### POST /api/v1/copilot/analyze

```
Request:
{
  "type": "report" | "email" | "sales" | "quotation" | "meeting" | "inventory",
  "parameters": {
    // type-specific parameters
  }
}

Response 200:
{
  "content": "## Monthly Business Report...",
  "format": "markdown",
  "metadata": {
    "generatedAt": "2026-07-04T10:00:00Z",
    "dataPoints": 24,
    "confidence": 0.95
  }
}
```

---

## 5. Inventory

### GET /api/v1/inventory/products

```
Query: ?search=wireless&category=Electronics&status=low-stock&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "prd_001",
      "name": "Wireless Mouse Pro",
      "category": "Electronics",
      "stock": 23,
      "minStock": 30,
      "price": 2499,
      "status": "low-stock",
      "lastRestocked": "2026-06-15",
      "supplier": "TechDistributors Inc."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}
```

### GET /api/v1/inventory/products/:id

```
Response 200:
{
  "id": "prd_001",
  "name": "Wireless Mouse Pro",
  "category": "Electronics",
  "stock": 23,
  "minStock": 30,
  "maxStock": 100,
  "price": 2499,
  "cost": 1850,
  "status": "low-stock",
  "sku": "WM-001",
  "supplier": "TechDistributors Inc.",
  "leadTime": 5,
  "lastRestocked": "2026-06-15",
  "monthlySales": 45,
  "reorderQuantity": 50
}
```

### POST /api/v1/inventory/products

```
Request:
{
  "name": "New Product",
  "category": "Electronics",
  "stock": 50,
  "minStock": 20,
  "price": 3999,
  "supplier": "Supplier Name"
}

Response 201: { "id": "prd_011", ...product }
```

### POST /api/v1/inventory/restock

```
Request:
{
  "items": [
    { "productId": "prd_001", "quantity": 50 },
    { "productId": "prd_002", "quantity": 30 }
  ]
}

Response 200:
{
  "orderId": "po_001",
  "items": 2,
  "totalCost": 19250,
  "estimatedDelivery": "2026-07-09"
}
```

### GET /api/v1/inventory/alerts

```
Response 200:
{
  "alerts": [
    {
      "productId": "prd_001",
      "name": "Wireless Mouse Pro",
      "type": "low-stock",
      "stock": 23,
      "minStock": 30,
      "daysUntilStockout": 6,
      "recommendedAction": "Reorder 50 units"
    }
  ]
}
```

---

## 6. Workflows

### GET /api/v1/workflows

```
Query: ?type=leave&status=pending&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "wf_001",
      "type": "leave",
      "title": "Annual Leave — Priya Sharma",
      "status": "pending",
      "createdAt": "2026-07-02T09:30:00Z",
      "createdBy": "Priya Sharma",
      "steps": [
        { "label": "Submitted", "status": "completed", "timestamp": "2026-07-02T09:30:00Z" },
        { "label": "AI Validation", "status": "completed", "timestamp": "2026-07-02T09:31:00Z" },
        { "label": "Manager Review", "status": "active" },
        { "label": "Approved", "status": "pending" },
        { "label": "Notification Sent", "status": "pending" }
      ]
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 4 }
}
```

### GET /api/v1/workflows/:id

```
Response 200: { ...fullWorkflow }
```

### POST /api/v1/workflows/:id/approve

```
Request:
{
  "comment": "Approved — leave dates confirmed with team"
}

Response 200:
{
  "status": "approved",
  "steps": [...]  // Updated with current step → completed
}
```

### POST /api/v1/workflows/:id/reject

```
Request:
{
  "comment": "Please resubmit with manager approval",
  "reason": "insufficient_info"
}

Response 200:
{
  "status": "rejected",
  "comment": "Please resubmit with manager approval"
}
```

### POST /api/v1/workflows

```
Request:
{
  "type": "leave",
  "title": "Annual Leave — John Doe",
  "data": {
    "employee": "John Doe",
    "startDate": "2026-07-20",
    "endDate": "2026-07-24",
    "reason": "Family vacation"
  }
}

Response 201: { "id": "wf_005", ...workflow }
```

---

## 7. Analytics

### GET /api/v1/analytics/revenue

```
Query: ?period=monthly&from=2025-07&to=2026-07

Response 200: { "data": [...], "summary": {...} }
```

### GET /api/v1/analytics/growth

```
Query: ?period=quarterly

Response 200:
{
  "data": [
    { "quarter": "Q1 2025", "revenue": 123000, "cost": 98000, "profit": 25000 }
  ],
  "projections": {
    "nextQuarter": { "revenue": 248000, "profit": 116000 },
    "annualRunRate": 989000
  }
}
```

### GET /api/v1/analytics/insights

```
Response 200:
{
  "insights": [
    { "icon": "trending-up", "text": "Revenue is up 14% this month — highest growth in Q4", "color": "green", "type": "positive" },
    { "icon": "alert-triangle", "text": "Wireless Mouse stock predicted to run out in 6 days", "color": "amber", "type": "warning" }
  ],
  "generatedAt": "2026-07-04T10:00:00Z"
}
```

---

## 8. AI (Gemini)

All AI endpoints use the KeyManager for multi-key failover.

### POST /api/v1/ai/generate

```
Request:
{
  "prompt": "Generate a monthly business report based on current data",
  "context": { /* business data snapshot */ },
  "type": "report"
}

Response 200:
{
  "content": "## Monthly Report...",
  "model": "gemini-2.0-flash",
  "tokensUsed": 456,
  "keyUsed": "key_01"
}

Response 429:
{
  "error": "Rate limit exceeded. Retry with different key.",
  "code": "RATE_LIMIT"
}
```

### GET /api/v1/ai/keys/status

```
Response 200:
{
  "keys": [
    { "id": "key_01", "status": "active", "requestsToday": 234, "dailyCap": 1500 },
    { "id": "key_02", "status": "cooldown", "cooldownUntil": "2026-07-04T11:00:00Z" }
  ]
}
```

---

## 9. Settings

### GET /api/v1/settings/profile

```
Response 200:
{
  "name": "Sumith Kumar",
  "email": "sumith@novatech.com",
  "phone": "+91 98765 43210",
  "avatar": null
}
```

### PATCH /api/v1/settings/profile

```
Request:
{
  "name": "Sumith Kumar",
  "phone": "+91 98765 43210"
}

Response 200: { ...updatedProfile }
```

### GET /api/v1/settings/company

```
Response 200:
{
  "name": "NovaTech Solutions",
  "industry": "Technology & Business Services",
  "employeeCount": 48,
  "description": "..."
}
```

### PATCH /api/v1/settings/notifications

```
Request:
{
  "workflowApprovals": true,
  "inventoryAlerts": true,
  "weeklyReport": true,
  "aiInsights": true,
  "teamUpdates": false,
  "billing": true
}

Response 200: { ...updatedPreferences }
```

---

## 10. Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `AUTH_INVALID` | 401 | Invalid email or password |
| `AUTH_EXPIRED` | 401 | Token expired |
| `AUTH_REQUIRED` | 401 | No token provided |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request body |
| `RATE_LIMIT` | 429 | API rate limit exceeded |
| `AI_SERVICE_DOWN` | 503 | AI service unavailable |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 11. Future Endpoints

| Method | Path | Feature | Priority |
|--------|------|---------|----------|
| GET | /api/v1/dashboard/ai/insights | AI-powered insights | Medium |
| POST | /api/v1/copilot/stream | Streaming chat response | High |
| GET | /api/v1/inventory/forecast | AI demand forecasting | Low |
| GET | /api/v1/workflows/stats | Workflow completion metrics | Low |
| POST | /api/v1/notifications/mark-read | Mark notification as read | Medium |
| POST | /api/v1/upload | File attachment for copilot | Low |
