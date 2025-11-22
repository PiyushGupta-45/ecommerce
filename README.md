# NovaCommerce

Full-stack ecommerce experience with a React + Vite frontend and an Express + MongoDB backend. Shoppers can sign up, browse curated products, manage a cart, place secure orders, and follow real-time tracking. Admins gain additional capabilities for managing inventory and updating order statuses.

## Features

- **Authentication** – JWT-based signup/signin with persisted sessions and profile refresh.
- **Catalog & search** – Dynamic product grid with search, category filtering, and featured items on the home page.
- **Cart & checkout** – Client-side cart with quantity controls, checkout flow, payment simulation, and server-side order capture.
- **Order tracking** – Timeline view showing each fulfillment stage; admins can advance orders through statuses.
- **Admin console** – Manage products (create/delete) directly from the orders dashboard and monitor all customer purchases.

## Project structure

```
ecommerce/
├── env.example                # Frontend environment template
├── server/                    # Express API
│   ├── env.example            # Backend environment template
│   └── src/                   # API source (models, controllers, routes)
└── src/                       # React app
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas cluster (connection string ready)

## Backend setup

```bash
cd server
cp env.example .env          # add MONGODB_URI, JWT_SECRET, CLIENT_URL
npm install
npm run dev                  # starts API at http://localhost:5000
```

Key environment variables:

| Name         | Description                                  |
| ------------ | -------------------------------------------- |
| `PORT`       | API port (default `5000`)                    |
| `MONGODB_URI`| Atlas connection string                     |
| `JWT_SECRET` | Secret used to sign auth tokens             |
| `CLIENT_URL` | Allowed CORS origin (e.g., `http://localhost:5173`) |

## Frontend setup

```bash
cd ecommerce
cp env.example .env          # set VITE_API_URL if different
npm install
npm run dev                  # launches Vite dev server
```

- Default API base: `http://localhost:5000/api` (configurable via `VITE_API_URL`).
- Requires the backend to be running for auth, product, and order operations.

### Admin access

- Sign up a user through the UI, then in MongoDB Atlas update that document’s `role` field to `"admin"`.
- The next time the admin signs in, the orders dashboard will expose product management and status controls.

## Production build

```bash
# Frontend
npm run build

# Backend
cd server && npm run start
```

Deploy the React `dist/` output behind any static host and run the Express API (with the same environment variables) on your preferred Node hosting provider.
