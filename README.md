# Aurelia Grand

A standard MERN workspace with the original React hotel UI in `client/` and an Express + MongoDB backend in `server/`.

## Structure

- `client/` - Vite + React frontend
- `server/` - Express API, controllers, routes, Mongoose models, seed script
- `package.json` - npm workspaces root

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/aurelia-grand
CORS_ORIGIN=http://localhost:5173
```

3. Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

4. Seed MongoDB:
```bash
npm run seed
```

5. Start both apps:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173` and backend runs at `http://localhost:5000`.

## API

- `GET /api/health`
- `GET /api/healthz`
- `GET /api/hotel`
- `GET /api/rooms`
- `GET /api/rooms/featured`
- `GET /api/rooms/:id`
- `GET /api/availability`
- `POST /api/bookings`
- `GET /api/bookings/:confirmationCode`
- `GET /api/facilities`
- `GET /api/dining`
- `GET /api/gallery`
- `GET /api/testimonials`
- `GET /api/events/packages`
- `POST /api/events/inquiries`
- `POST /api/contact/messages`

## Notes

- The frontend UI/component structure was kept intact and moved into `client/src`.
- The old platform-specific workspace files were removed.
- The API hook layer now lives inside the client so the React pages can keep using the same query/mutation shape.
