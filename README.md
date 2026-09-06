# Hotel Management System

Phase 3 is a working React/Vite + Express + MongoDB hotel management application. React calls the Express REST API, controllers apply business rules, Mongoose persists documents, and MongoDB is the system of record.

## Run the full stack

1. Start MongoDB.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and `JWT_SECRET`.
3. Run `cd backend`, `npm install`, then `node seed/seedDatabase.js` once.
4. Start the API with `npm run dev` in `backend`.
5. Start the client with `npm install` and `npm run dev` from the repository root.

The client is available at `http://localhost:5173`; the API is available at `http://localhost:5000`.

## Collections and relationships

MongoDB collections are `users`, `rooms`, `guests`, `reservations`, `stays`, `fooditems`, `foodorders`, `invoices`, and `payments`. Reservations reference guests, rooms, and their creating user. Stays reference reservations, guests, and rooms. Food orders reference guests and food items. Invoices reference guests, reservations, and stays; payments reference invoices and guests. See [DATABASE_DESIGN.md](DATABASE_DESIGN.md) for the ERD.

## Main API areas

Authentication, room and guest CRUD, reservations with backend double-booking prevention, dashboard aggregates, food items/orders, invoices/payments, and persisted check-in/check-out workflows are implemented under `/api`. The backend README contains the endpoint list and seed instructions.

## Environment variables

`PORT`, `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` are required by the backend. `VITE_API_BASE_URL` is optional for the frontend and defaults to the Vite `/api` proxy.

## Known limitations

Housekeeping remains backed by its existing Phase 2 data module. The duplicate `server/` backend directory is retained for compatibility; `backend/` is the canonical MongoDB backend.

## Frontend notes

## API configuration

The Restaurant, Payments, and Invoices pages use the backend configured by `VITE_API_BASE_URL`. Copy `.env.example` to `.env` and set the URL for the API server. The client expects these endpoints:

- `GET /menu-items`
- `POST /orders` with `{ room, note, items, total }`
- `GET /payments`
- `PATCH /payments/:id` with `{ status: "Paid" }`
- `GET /invoices`

List endpoints may return either an array or an object with a `data` array. Records should use the existing page fields, including `id`, `amount`, and status fields.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
