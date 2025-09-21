# To-Do App (React + TypeScript)

This is a single-page To-Do application built with React + TypeScript. It simulates a REST API using a local `mockApi` (with artificial latency and optional failure) so you can practice loading states and error handling without a backend.

## Features
- Display list of To-Dos (title, description, createdAt)
- Add new To-Do
- Edit existing To-Do inline
- Toggle completion via checkbox
- Delete To-Do (with confirmation)
- Mock API implementing GET/POST/PUT/DELETE with simulated latency
- Loading indicators and error messages
- Strict TypeScript typing
- Data persisted to `localStorage` (mock API)

## How to run

1. Install dependencies
```bash
npm install
2. npm run dev
