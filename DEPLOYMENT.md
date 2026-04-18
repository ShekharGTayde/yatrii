# Yatri Deployment Guide

This project is easiest to deploy with:
- Frontend: Vercel
- Backend (API + Socket.IO): Render or Railway

Socket.IO does not run reliably on serverless function platforms for persistent websocket connections, so avoid putting the backend on Vercel if you need realtime ride events.

## 1) Backend Deployment (Render/Railway)

Use the `Backend` folder as the service root.

Build command:
`npm install`

Start command:
`npm start`

Required environment variables:
- `PORT=3000`
- `MONGODB_URL=<your-mongodb-uri-prefix>`
- `MONGODB_NAME=yatri`
- `JWT_SECRET=<strong-secret>`
- `JWT_SECRET_EXPIRY=24h`
- `CLIENT_URL=<your-frontend-url>`
- `RAZORPAY_KEY_ID=<optional>`
- `RAZORPAY_KEY_SECRET=<optional>`

Notes:
- `CLIENT_URL` supports one or more origins (comma-separated), for example:
  - `https://yatri.vercel.app`
  - `https://yatri.vercel.app,https://www.yatri.app`
- Cookie auth is configured for cross-site production (`SameSite=None; Secure`).

## 2) Frontend Deployment (Vercel)

Use the `frontend` folder as the Vercel project root.

Build command:
`npm run build`

Output directory:
`dist`

Required environment variables:
- `VITE_BASE_URL=https://<your-backend-domain>/api/v1`
- Optional: `VITE_SOCKET_URL=https://<your-backend-domain>`

Important:
- Do not add a trailing slash to `VITE_BASE_URL` in Render/Vercel settings.

If `VITE_SOCKET_URL` is not set, the app derives socket URL from `VITE_BASE_URL` automatically.

## 3) Post-Deployment Checks

1. Open frontend and login as user.
2. Verify `GET /api/v1/users/profile` succeeds with cookies.
3. Verify pickup/destination suggestions appear.
4. Verify fare endpoint returns values.
5. Open captain account and ensure socket events (new ride / confirm / start) work.

## 4) Common Issues

- 401 after login:
  - Confirm frontend and backend domains are set correctly.
  - Confirm `CLIENT_URL` exactly matches deployed frontend origin.
  - Clear browser cookies and login again.

- CORS error:
  - Add frontend origin to `CLIENT_URL` on backend.
  - Ensure requests target `/api/v1/...` endpoints and not backend root paths.

- Socket not connecting:
  - Ensure backend is on Render/Railway (not serverless-only runtime).
  - Confirm `VITE_SOCKET_URL` points to backend root URL.