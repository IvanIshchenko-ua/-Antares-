# -Antares-

Short README for this repository — a local admin panel and server for a school website.

## What is in this repository

- `Backend/` — Node.js/Express server (API, file uploads, authentication).
- `Frontend/` — React (Create React App) admin panel.
- `maybe/`, `docs/`, `main/` — auxiliary / older attempts and documentation.

## Quick start (local)

Requirements: Node.js (recommended v16+) and npm.

1) Install backend dependencies:

```bash
cd Backend
npm install
```

Start the backend (development / simple start):

```bash
# inside Backend
npm start
# this starts server.js (by default listens on PORT or 5000)
```

2) Install frontend dependencies and run the admin panel:

```bash
cd ../Frontend
npm install
npm run dev   # or npm start
```

The frontend is configured to proxy API requests to `http://localhost:5000` (see `proxy` in `Frontend/package.json`).

3) Build the frontend for production:

```bash
cd Frontend
npm run build
```

After building, static files are placed in `Frontend/build/` and can be served by the backend or a static host.

## Environment variables (recommended)

Create a `.env` file inside `Backend/` with the minimum required variables. Examples (adjust as needed):

- `PORT=5000`
- `MONGO_URI=mongodb://...` or other database connection string
- `JWT_SECRET=your_jwt_secret`
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` — if using S3/R2
- `S3_BUCKET` or other upload-related keys

Note: the code also includes dependencies for `mysql2` and `@aws-sdk` — only provide variables required for your use case.

## Important directories

- `Backend/controllers/` — API controllers (auth, news, gallery, content, users).
- `Backend/models/` — Mongoose/ORM models (`User`, `News`, `Gallery`, `Content`).
- `Backend/routes/` — API routes.
- `Backend/uploads/` — local folder for uploaded files (if used).
- `Frontend/src/components/` — React components for the admin panel.

## Useful commands

- Install both backend and frontend dependencies:

```bash
cd Backend && npm install
cd ../Frontend && npm install
```

- Start the backend in production (example):

```bash
cd Backend
NODE_ENV=production node server.js
```

## Debugging tips

- Make sure the backend `PORT` and the proxy in `Frontend/package.json` match.
- If the frontend cannot reach the API — check CORS settings in the backend and ensure the server is running.
- Check server logs in the terminal where you ran `npm start`.

## Migrations / Databases

There is no dedicated migrations system in this repository. Database connection is configured in `Backend/db.js` — check that file for details.

## License & contributions

If you want to contribute, open a pull request or contact me through the repository.
