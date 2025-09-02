# Repository Guidelines

## Project Structure & Module Organization
- `server/`: Express API (`server/index.js`), Twilio routes in `server/routes/` (`twilio.js`, `config.js`).
- `client/`: React + TypeScript app.
  - `client/src/`: UI code (`App.tsx`, styles, tests).
  - `client/public/`: HTML and static assets.
- Root `package.json`: Dev orchestration (concurrently), server entrypoint.

## Build, Test, and Development Commands
- `npm run dev`: Run server (nodemon) and client (CRA) together.
- `npm run server:dev`: Start API at `http://localhost:3001`.
- `npm run client:dev`: Start UI at `http://localhost:3000` with proxy to API.
- `npm run build`: Build React app to `client/build/`.
- `npm start`: Start API in production serving `client/build/`.
- Tests: `cd client && npm test` (Jest via CRA).

## Coding Style & Naming Conventions
- Indentation: 2 spaces; include semicolons; single quotes in Node code.
- React: Components in PascalCase (`CallCard.tsx`), hooks `use*.ts`, utilities `camelCase`.
- Server: Route files `kebab-case` (e.g., `incoming-calls.js`); functions `camelCase`.
- TypeScript in `client/`; CommonJS in `server/`.
- Linting: CRA ESLint presets (`react-app`). Keep imports ordered and remove unused code.

## Testing Guidelines
- Frameworks: Jest + React Testing Library (via CRA).
- File names: `*.test.tsx` near components or `client/src/__tests__/`.
- Cover UI states and API interactions (loading, success, error).
- Run before PRs: `cd client && npm test` (watch mode acceptable locally).

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (`feat:`, `fix:`, `chore:`) with clear scope.
- Branches: `feature/<short-desc>` or `fix/<short-desc>`.
- PRs: Provide description, steps to test, screenshots/GIFs for UI, and linked issues. Keep changes focused and small.

## Security & Configuration Tips
- Store secrets in root `.env`: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `WEBHOOK_BASE_URL`, `PORT`, `TWILIO_NUMBER_*`.
- Never commit credentials; use ngrok for local webhooks.
- Verify console webhooks point to `/api/twilio/sms` and `/api/twilio/incoming-call`.

