# Environment Variables Setup Guide

## 🔴 CRITICAL: Backend Environment Variables (Render Dashboard)

**You MUST set these in your Render dashboard** - Go to your service → Settings → Environment

### Required Backend Variables:

1. **JWT_SECRET** ⚠️ **REQUIRED FOR AUTHENTICATION**
   ```
   Generate a secure random string:
   - Use: openssl rand -base64 32
   - Or any random string (minimum 32 characters)
   - Example: mySuperSecretJWTKey12345678901234567890
   ```
   **Without this, authentication will NOT work!**

2. **MONGODB_URI** ⚠️ **REQUIRED**
   ```
   Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```
   **Without this, database connection will fail!**

3. **NODE_ENV**
   ```
   Value: production
   ```

4. **PORT** (Optional - Render sets this automatically)
   ```
   Value: Usually 10000 (Render sets this automatically)
   ```

5. **CLIENT_URL** (Optional - for CORS)
   ```
   Your frontend URL (e.g., https://your-frontend.onrender.com)
   Or leave empty to allow all origins (*)
   ```

---

## 🟢 Frontend Environment Variables (If you have a frontend)

If you have a React/Vue/Angular frontend, create a `.env` file in your frontend directory:

### Example Frontend `.env` file:

```env
# Backend API URL
REACT_APP_API_URL=https://ecommerce-ltem.onrender.com
# or
VITE_API_URL=https://ecommerce-ltem.onrender.com
# or
NEXT_PUBLIC_API_URL=https://ecommerce-ltem.onrender.com
```

**Note:** The prefix depends on your framework:
- **React (Create React App)**: `REACT_APP_`
- **Vite**: `VITE_`
- **Next.js**: `NEXT_PUBLIC_`

---

## 📋 Step-by-Step: Setting Variables in Render

### For Backend (Render Dashboard):

1. Go to https://dashboard.render.com
2. Click on your **ecommerce-api** service
3. Click on **Environment** in the left sidebar
4. Click **Add Environment Variable** for each variable:

   ```
   Key: JWT_SECRET
   Value: [your-generated-secret-key]
   ```

   ```
   Key: MONGODB_URI
   Value: [your-mongodb-connection-string]
   ```

   ```
   Key: NODE_ENV
   Value: production
   ```

   ```
   Key: CLIENT_URL (optional)
   Value: [your-frontend-url]
   ```

5. Click **Save Changes**
6. **Redeploy** your service (Render will auto-deploy or you can manually trigger)

---

## 🧪 Testing Your Environment Variables

### Check if JWT_SECRET is set:
After deployment, check your Render logs. If you see:
- ✅ "MongoDB connected" - MONGODB_URI is working
- ❌ "Missing JWT_SECRET" - JWT_SECRET is NOT set
- ❌ "Server configuration error" - JWT_SECRET is missing

### Test Authentication:
```bash
# Register
curl -X POST https://ecommerce-ltem.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# If successful, you'll get a token
# If you get "Server configuration error", JWT_SECRET is missing!
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Server configuration error" or "Missing JWT_SECRET"
**Problem:** JWT_SECRET not set in Render
**Solution:** 
1. Go to Render dashboard → Environment
2. Add `JWT_SECRET` with a random string value
3. Redeploy

### Issue 2: "MongoDB connection failed"
**Problem:** MONGODB_URI not set or incorrect
**Solution:**
1. Check your MongoDB connection string
2. Make sure it's set in Render Environment variables
3. Test the connection string locally first

### Issue 3: CORS errors from frontend
**Problem:** CLIENT_URL not set or incorrect
**Solution:**
1. Set `CLIENT_URL` in Render to your frontend URL
2. Or leave it empty to allow all origins (for development)

### Issue 4: Environment variables not loading
**Problem:** Using .env file on Render (won't work!)
**Solution:**
- **On Render:** Set variables in Dashboard (NOT in .env file)
- **Locally:** Use .env file in `server/.env`

---

## 📝 Local Development Setup

For local development, create `ecommerce/server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-local-secret-key-here

# CORS (optional)
CLIENT_URL=http://localhost:3000
```

**Important:** Never commit `.env` files to git! They should be in `.gitignore`

---

## ✅ Checklist

Before deploying, make sure:

- [ ] JWT_SECRET is set in Render dashboard
- [ ] MONGODB_URI is set in Render dashboard
- [ ] NODE_ENV is set to `production` in Render dashboard
- [ ] CLIENT_URL is set (if you have a frontend)
- [ ] Service has been redeployed after adding variables
- [ ] Test authentication endpoint to verify it works

---

## 🚨 Quick Fix for Authentication Issues

If authentication is still not working:

1. **Check Render logs** - Look for error messages
2. **Verify JWT_SECRET exists** - It's the #1 cause of auth failures
3. **Test with curl/Postman** - Verify the API works directly
4. **Check frontend API URL** - Make sure it points to correct backend URL
5. **Verify token is being sent** - Check Authorization header format: `Bearer <token>`

