# Yatri Ride Booking Platform

A full-stack ride booking platform built with **React (Vite)** for the frontend and **Node.js/Express/MongoDB** for the backend.  
Supports user and captain (driver) registration, authentication, ride creation, real-time ride status via Socket.IO, and Razorpay payment integration.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Backend API Routes](#backend-api-routes)
  - [User Routes](#user-routes)
  - [Captain Routes](#captain-routes)
  - [Ride Routes](#ride-routes)
  - [Map Routes](#map-routes)
  - [Payment Routes](#payment-routes)
- [Frontend Routes](#frontend-routes)
- [Socket.IO Events](#socketio-events)
- [Setup & Run](#setup--run)
- [Excluding .env Files](#excluding-env-files)

---

## Project Structure

```
Yatri/
├── Backend/
│   ├── app.js
│   ├── index.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
```

---

## Backend API Routes

### User Routes (`/api/v1/users`)
| Method | Endpoint                | Description                       | Auth         |
|--------|-------------------------|-----------------------------------|--------------|
| POST   | `/register`             | Register a new user               | No           |
| POST   | `/login`                | Login user                        | No           |
| GET    | `/logout`               | Logout user                       | Yes          |
| GET    | `/regeneratedToken`     | Regenerate JWT token              | Yes          |
| GET    | `/profile`              | Get user profile                  | Yes          |

---

### Captain Routes (`/api/v1/captains`)
| Method | Endpoint                | Description                       | Auth         |
|--------|-------------------------|-----------------------------------|--------------|
| POST   | `/register`             | Register a new captain            | No           |
| POST   | `/login`                | Login captain                     | No           |
| GET    | `/logout`               | Logout captain                    | Yes          |
| GET    | `/profile`              | Get captain profile               | Yes          |

---

### Ride Routes (`/api/v1/rides`)
| Method | Endpoint                | Description                       | Auth         |
|--------|-------------------------|-----------------------------------|--------------|
| POST   | `/create`               | Create a new ride                 | User         |
| GET    | `/get-fare`             | Get fare for a ride               | User         |
| POST   | `/confirm`              | Captain confirms a ride           | Captain      |
| GET    | `/start-ride`           | Start a ride (with OTP)           | Captain      |
| POST   | `/end-ride`             | End a ride                        | Captain      |

---

### Map Routes (`/api/v1/maps`)
| Method | Endpoint                | Description                       | Auth         |
|--------|-------------------------|-----------------------------------|--------------|
| GET    | `/get-coordinates`      | Get coordinates for address       | User         |
| GET    | `/get-distance-time`    | Get distance and time             | User         |
| GET    | `/get-suggestions`      | Get address suggestions           | User         |

---

### Payment Routes (`/api/v1/order`)
| Method | Endpoint                | Description                       |
|--------|-------------------------|-----------------------------------|
| POST   | `/order`                | Create a Razorpay order           |
| POST   | `/order/validate`       | Validate Razorpay payment         |
| POST   | `/order/fail`           | Mark order as failed              |

---

## Frontend Routes

| Path                | Component              | Description                |
|---------------------|-----------------------|----------------------------|
| `/`                 | Start                  | Landing page               |
| `/user-login`       | UserLogin              | User login                 |
| `/user-signup`      | UserSignup             | User registration          |
| `/user-logout`      | UserLogout             | User logout                |
| `/home`             | Home                   | User dashboard/home        |
| `/riding`           | Riding                 | User ride in progress      |
| `/captain-login`    | CaptainLogin           | Captain login              |
| `/captain-signup`   | CaptainSignup          | Captain registration       |
| `/captain-logout`   | CaptainLogout          | Captain logout             |
| `/captain-home`     | CaptainHome            | Captain dashboard/home     |
| `/captain-riding`   | CaptainRiding          | Captain ride in progress   |

---

## Socket.IO Events

- `join` (user/captain joins)
- `new-ride` (sent to captains)
- `ride-confirmed` (sent to user)
- `ride-started` (sent to user)
- `ride-ended` (sent to user)
- ...and more as needed

---


