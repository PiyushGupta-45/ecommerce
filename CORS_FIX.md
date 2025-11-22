# CORS Fix Guide

## ✅ Fixed CORS Configuration

I've updated the CORS configuration to:
- ✅ Allow all Vercel preview deployments (`.vercel.app` domains)
- ✅ Allow localhost for development
- ✅ Support multiple origins via comma-separated CLIENT_URL
- ✅ Allow requests with no origin (mobile apps, curl, etc.)

## 🔧 Environment Variables Setup

### For Render Backend:

Set in Render Dashboard → Environment:

1. **CLIENT_URL** (Optional - for specific origins)
   ```
   For single origin:
   CLIENT_URL=https://your-frontend.vercel.app
   
   For multiple origins (comma-separated):
   CLIENT_URL=https://your-frontend.vercel.app,https://another-domain.com
   ```

2. **Or leave CLIENT_URL empty** - The new config will automatically allow:
   - All Vercel preview deployments (`.vercel.app`)
   - Localhost (for development)
   - Any origin if CLIENT_URL is not set

## ⚠️ Important: Route Mismatch Issue

Your frontend is calling: `/auth/register`
But your backend has: `/api/auth/register`

### Option 1: Fix Frontend (Recommended)
Update your frontend API base URL to include `/api`:
```javascript
// Frontend .env
REACT_APP_API_URL=https://ecommerce-umber-pi.vercel.app/api
// or
VITE_API_URL=https://ecommerce-umber-pi.vercel.app/api
```

Then your frontend calls would be:
- `/api/auth/register` ✅
- `/api/auth/login` ✅
- `/api/products` ✅

### Option 2: Add Route Aliases in Backend
If you can't change the frontend, we can add route aliases without `/api` prefix.

## 🧪 Testing CORS

After deploying, test with:

```bash
# Test from your frontend origin
curl -X OPTIONS https://ecommerce-umber-pi.vercel.app/api/auth/register \
  -H "Origin: https://ecommerce-7awrxsyqh-piyushgupta-45s-projects.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

You should see `Access-Control-Allow-Origin` header in the response.

## 📋 Checklist

- [x] CORS configuration updated to allow Vercel domains
- [ ] Backend redeployed with new CORS config
- [ ] Frontend API URL includes `/api` prefix (or backend has route aliases)
- [ ] Test registration/login from frontend

## 🚀 Next Steps

1. **Redeploy your backend** (Render or Vercel)
2. **Update frontend API URL** to include `/api` prefix
3. **Test authentication** from your frontend

The CORS error should now be resolved! 🎉

