# 🚀 Postman Testing Guide - Vendor Flow

Here is the step-by-step guide to testing the entire Vendor Lifecycle using Postman.

## 📦 Base URL

Set a variable `{{URL}}` to: `http://localhost:3000/api/v1`

---

## 1️⃣ Vendor Application (Public)

**Role**: Public User (No Token)

### Submit Application

- **Method**: `POST`
- **URL**: `{{URL}}/vendor/apply`
- **Body** (JSON):

```json
{
  "businessName": "Ocean View Resorts",
  "businessEmail": "info@oceanview.com",
  "businessPhone": "+13051234567",
  "businessAddress": "101 Beach Blvd, Miami, FL",
  "description": "Premium seaside resorts",
  "numberOfProperties": 3
}
```

> **Copy the `_id` from the response (This is the VENDOR ID).**

---

## 2️⃣ Admin Review (Admin Only)

**Role**: Admin (Requires Admin Token)

### Login as Admin (Existing Admin User)

- **Method**: `POST`
- **URL**: `{{URL}}/auth/login`
- **Body**:

```json
{
  "email": "admin@example.com",
  "password": "your_admin_password"
}
```

> **Copy the `token` from response.**

### Get Pending Applications

- **Method**: `GET`
- **URL**: `{{URL}}/admin/vendors/pending`
- **Headers**:
  - `Authorization`: `Bearer <ADMIN_TOKEN>`

### Approve Vendor

- **Method**: `PUT`
- **URL**: `{{URL}}/admin/vendors/:id/approve`
  - Replace `:id` with the Vendor ID from Step 1.
- **Headers**:
  - `Authorization`: `Bearer <ADMIN_TOKEN>`

> **Success!** This will create a specific User account for the vendor.
> **Note the email** (it's the `businessEmail` from step 1).

---

## 3️⃣ Vendor Onboarding

**Role**: Vendor (New Account)

### Login as Vendor

- **Method**: `POST`
- **URL**: `{{URL}}/auth/login`
- **Body**:

```json
{
  "email": "info@oceanview.com",
  "password": "password123"
}
```

_(Note: Check your database/logs for the generated password. In the current simplified code, the password might need to be reset or checked in the `vendor.service.js` logic - currently it sets a random temporary password.)_

> **Developer Tip**: In `vendor.service.js`, look for `Math.random().toString(36).slice(-8)`. For testing, you might want to hardcode it or check the console if you log it.

---

## 4️⃣ Vendor Operations

**Role**: Vendor (Requires Vendor Token)

### Create Hotel

- **Method**: `POST`
- **URL**: `{{URL}}/vendor/hotels`
- **Headers**: `Authorization`: `Bearer <VENDOR_TOKEN>`
- **Body**:

```json
{
  "name": "Ocean View Hotel 1",
  "type": "Hotel",
  "city": "Miami",
  "address": "123 Ocean Drive",
  "desc": "Beautiful hotel",
  "cheapestPrice": 200,
  "images": ["url1", "url2"]
}
```

### Get My Hotels

- **Method**: `GET`
- **URL**: `{{URL}}/vendor/hotels`
- **Headers**: `Authorization`: `Bearer <VENDOR_TOKEN>`

### Dashboard Stats

- **Method**: `GET`
- **URL**: `{{URL}}/vendor/dashboard/stats`
- **Headers**: `Authorization`: `Bearer <VENDOR_TOKEN>`

---

## 5️⃣ Admin Approves Hotel

**Role**: Admin

### Approve Hotel

- **Method**: `PUT`
- **URL**: `{{URL}}/admin/hotels/:id/approve`
- **Headers**: `Authorization`: `Bearer <ADMIN_TOKEN>`

---

## 🐞 Troubleshooting

- **401 Unauthorized**: Forgot to add Bearer Token header.
- **403 Forbidden**: Using wrong user role (e.g., trying to approve as User instead of Admin).
- **500 Error**: Check backend terminal for logs.
