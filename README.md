# React + Vite

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
