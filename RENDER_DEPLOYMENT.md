# Render Deployment Guide

## Issues Fixed

1. **Server Binding**: Updated server to bind to `0.0.0.0` instead of `localhost` (required for Render)
2. **Procfile**: Created Procfile to tell Render how to start the server
3. **render.yaml**: Created configuration file for easier deployment

## Render Dashboard Configuration

When setting up your service on Render, configure the following:

### Basic Settings:
- **Name**: ecommerce-api (or your preferred name)
- **Environment**: Node
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Root Directory**: Leave empty (or set to `server` if deploying from root)

### Environment Variables:
Add these in the Render dashboard under "Environment":

1. **MONGODB_URI**: Your MongoDB connection string
2. **PORT**: Render will set this automatically (usually 10000)
3. **NODE_ENV**: `production`
4. **CLIENT_URL**: Your frontend URL (if you have one)
5. **JWT_SECRET**: Your JWT secret key (if using authentication)
6. Any other environment variables your app needs

### Alternative: Using render.yaml

If you prefer, you can use the `render.yaml` file:
1. Connect your repository to Render
2. Render will automatically detect and use `render.yaml`
3. Make sure to add environment variables in the Render dashboard

## Common Issues

- **Port binding**: The server now binds to `0.0.0.0` which is required for Render
- **Root directory**: If your service is in a subdirectory, make sure to set the root directory or use the correct path in build/start commands
- **Environment variables**: All required env vars must be set in Render dashboard

## Testing Locally

To test the changes locally:
```bash
cd server
npm start
```

The server should now bind to `0.0.0.0` and work on Render.

