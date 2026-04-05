# 💰 Finance Tracker API

A RESTful backend API for personal finance tracking — manage income, expenses, users, and analytics dashboards. Built with **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Project Structure

```
backend/
├── app.js                        # Entry point
├── package.json
├── config/
│   └── db.js                     # MongoDB connection
├── models/
│   ├── user.model.js             # User schema
│   └── transaction.model.js      # Transaction schema
├── controllers/
│   ├── auth.controller.js        # Register & login logic
│   ├── users.controller.js       # User CRUD
│   ├── transaction.controller.js # Transaction CRUD
│   └── dashboard.controller.js   # Analytics & summaries
├── routes/
│   ├── auth.routes.js            # /api/auth
│   ├── users.routes.js           # /api/users
│   ├── transactions.routes.js    # /api/transactions
│   └── dashboard.route.js        # /api/dashboard
└── middleware/
    ├── auth.js                   # JWT auth & role authorization
    └── validate.js               # Request validation rules
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your_super_secret_key
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

---

## 🔐 Authentication

The API uses **JWT (JSON Web Token)** based authentication.

- Tokens expire in **1 hour**
- Include the token in the `Authorization` header for protected routes:

```
Authorization: Bearer <your_token>
```

### Roles & Permissions

| Role      | Permissions                                      |
|-----------|--------------------------------------------------|
| `Viewer`  | Read-only access to transactions and dashboard   |
| `analyst` | Read-only access to transactions and dashboard   |
| `admin`   | Full access — create, update, delete everything  |

> **Note:** Role names are case-sensitive. `Viewer` (capital V) is the default role.

---

## 📡 API Endpoints

### 🔑 Auth Routes — `/api/auth`

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "Viewer"
}
```

**Validation Rules:**
- `name` — required
- `email` — must be a valid email
- `password` — minimum 6 characters
- `role` — must be one of: `Viewer`, `analyst`, `admin`

**Success Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt_token>",
  "user": {
    "id": "64abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Viewer"
  }
}
```

---

#### `POST /api/auth/login`
Login and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "<jwt_token>",
  "user": {
    "id": "64abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Viewer"
  }
}
```

---

### 👤 User Routes — `/api/users`

> 🔒 All routes require authentication. **Admin only.**

#### `GET /api/users`
Get all users.

**Success Response `200`:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "_id": "...", "name": "Alice", "email": "alice@example.com", "role": "admin" }
  ]
}
```

---

#### `GET /api/users/:id`
Get a single user by ID.

**Success Response `200`:**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Alice", "email": "alice@example.com", "role": "admin" }
}
```

---

#### `PUT /api/users/:id`
Update a user's name or email.

**Request Body:**
```json
{
  "name": "Alice Updated",
  "email": "new@example.com"
}
```

---

#### `DELETE /api/users/:id`
Delete a user by ID.

**Success Response `200`:**
```json
{ "success": true, "message": "User deleted" }
```

---

### 💳 Transaction Routes — `/api/transactions`

> 🔒 All routes require authentication.

#### `GET /api/transactions`
Get all transactions for the logged-in user, with filtering and pagination.

**Roles:** `Viewer`, `analyst`, `admin`

**Query Parameters:**

| Parameter   | Type   | Description                         |
|-------------|--------|-------------------------------------|
| `type`      | string | Filter by `income` or `expense`     |
| `category`  | string | Filter by category (case-insensitive)|
| `startDate` | ISO date | Filter from this date             |
| `endDate`   | ISO date | Filter to this date               |
| `page`      | number | Page number (default: `1`)          |
| `limit`     | number | Results per page (default: `10`)    |

**Success Response `200`:**
```json
{
  "success": true,
  "data": [...],
  "total": 42,
  "page": 1,
  "totalPages": 5
}
```

---

#### `GET /api/transactions/:id`
Get a specific transaction by ID.

**Roles:** `Viewer`, `analyst`, `admin`

---

#### `POST /api/transactions`
Create a new transaction.

**Roles:** `admin` only

**Request Body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2025-04-01",
  "notes": "Monthly salary"
}
```

**Validation Rules:**
- `amount` — positive number, minimum `0.01`
- `type` — must be `income` or `expense`
- `category` — required, non-empty string
- `date` — optional, ISO 8601 format
- `notes` — optional, max 500 characters

---

#### `PUT /api/transactions/:id`
Update an existing transaction.

**Roles:** `admin` only

> Only updates transactions created by the logged-in user.

---

#### `DELETE /api/transactions/:id`
Delete a transaction.

**Roles:** `admin` only

> Only deletes transactions created by the logged-in user.

---

### 📊 Dashboard Routes — `/api/dashboard`

> 🔒 All routes require authentication. Accessible by all roles.

#### `GET /api/dashboard/summary`
Get total income, total expense, and net balance for the logged-in user.

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpense": 20000,
    "netBalance": 30000
  }
}
```

---

#### `GET /api/dashboard/categories`
Get spending/income totals grouped by category.

**Query Parameters:**

| Parameter | Type   | Description                      |
|-----------|--------|----------------------------------|
| `type`    | string | Optional: `income` or `expense`  |

**Success Response `200`:**
```json
{
  "success": true,
  "data": [
    { "_id": { "category": "Salary", "type": "income" }, "total": 50000, "count": 1 },
    { "_id": { "category": "Food", "type": "expense" }, "total": 5000, "count": 12 }
  ]
}
```

---

#### `GET /api/dashboard/trends`
Get monthly income vs. expense trends for a given year.

**Query Parameters:**

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| `year`    | number | Year to query (default: current year) |

**Success Response `200`:**
```json
{
  "success": true,
  "year": 2025,
  "data": [
    { "month": 1, "income": 50000, "expense": 12000 },
    { "month": 2, "income": 50000, "expense": 9500 }
  ]
}
```

---

#### `GET /api/dashboard/recent`
Get the 5 most recent transactions for the logged-in user.

**Success Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "amount": 5000,
      "type": "expense",
      "category": "Food",
      "date": "2025-04-01T00:00:00.000Z",
      "createdBy": { "name": "John Doe" }
    }
  ]
}
```

---

## 🗄️ Data Models

### User

| Field      | Type    | Required | Default   | Notes                              |
|------------|---------|----------|-----------|------------------------------------|
| `name`     | String  | ✅       | —         |                                    |
| `email`    | String  | ✅       | —         | Unique, lowercase                  |
| `password` | String  | ✅       | —         | Hashed with bcrypt, min 6 chars    |
| `role`     | String  | ✅       | `Viewer`  | One of: `Viewer`, `analyst`, `admin` |
| `isactive` | Boolean | —        | `true`    | Inactive users cannot login        |

### Transaction

| Field       | Type     | Required | Default     | Notes                          |
|-------------|----------|----------|-------------|--------------------------------|
| `amount`    | Number   | ✅       | —           | Must be > 0                    |
| `type`      | String   | ✅       | —           | `income` or `expense`          |
| `category`  | String   | ✅       | —           | e.g. Salary, Food, Rent        |
| `date`      | Date     | —        | `Date.now`  |                                |
| `notes`     | String   | —        | —           | Max 500 characters             |
| `createdBy` | ObjectId | ✅       | —           | Reference to User              |

---

## ⚠️ Error Responses

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning                              |
|-------------|--------------------------------------|
| `400`       | Bad request / validation failed      |
| `401`       | Unauthorized / invalid or missing token |
| `403`       | Forbidden / insufficient role        |
| `404`       | Resource not found                   |
| `500`       | Internal server error                |

---

## 🛠️ Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Runtime     | Node.js                     |
| Framework   | Express.js v5               |
| Database    | MongoDB + Mongoose           |
| Auth        | JWT + bcryptjs              |
| Validation  | express-validator           |
| Dev Tools   | nodemon                     |

---

## 📌 Known Caveats

- Role names are **case-sensitive**: `Viewer` (capital V) vs `analyst` and `admin` (lowercase). Ensure consistency between registration and route authorization.
- JWT tokens expire in **1 hour** — clients must re-authenticate after expiry.
- Transaction mutations (create, update, delete) are scoped to the **logged-in user** — admins cannot modify other users' transactions via these endpoints.
