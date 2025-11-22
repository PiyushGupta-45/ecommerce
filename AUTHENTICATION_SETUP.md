# Authentication Setup Guide

## Required Environment Variables

Make sure these are set in your Render dashboard under "Environment":

1. **JWT_SECRET** (REQUIRED) - A secret key for signing JWT tokens
   - Generate a secure random string (at least 32 characters)
   - Example: `openssl rand -base64 32`
   - This is critical - authentication will fail without it!

2. **MONGODB_URI** (REQUIRED) - Your MongoDB connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

3. **NODE_ENV** - Set to `production` for production

4. **CLIENT_URL** (Optional) - Your frontend URL for CORS

## API Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <your-token>
```

## Common Issues

### 1. "Server configuration error"
- **Cause**: JWT_SECRET is not set in Render environment variables
- **Fix**: Add JWT_SECRET to your Render environment variables

### 2. "Invalid credentials"
- **Cause**: Wrong email/password or user doesn't exist
- **Fix**: Check your credentials or register a new user

### 3. "Not authorized, token missing"
- **Cause**: Authorization header is missing or incorrectly formatted
- **Fix**: Include header: `Authorization: Bearer <token>`

### 4. "Token expired"
- **Cause**: JWT token has expired (default: 7 days)
- **Fix**: Login again to get a new token

## Testing Authentication

### Using cURL:

**Register:**
```bash
curl -X POST https://ecommerce-ltem.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST https://ecommerce-ltem.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Current User:**
```bash
curl -X GET https://ecommerce-ltem.onrender.com/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman/Thunder Client:
1. Set method to POST/GET
2. Set URL to your endpoint
3. For protected routes, add header: `Authorization: Bearer <token>`
4. For POST requests, set body to JSON with required fields

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional, for validation errors
}
```

Success responses:
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": { ... }
  }
}
```

