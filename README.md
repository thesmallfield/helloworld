# helloworld

The Small Field sample app: `ui`, `api1`, `api2`.

Commands: `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test`.

## Run locally

```sh
pnpm install
pnpm --filter @thesmallfield/helloworld-api1 build
pnpm --filter @thesmallfield/helloworld-api2 build
PORT=8081 pnpm --filter @thesmallfield/helloworld-api1 start
PORT=8082 pnpm --filter @thesmallfield/helloworld-api2 start
pnpm --filter @thesmallfield/helloworld-ui dev
```

Open http://localhost:5173. The dev server proxies `/api1` and `/api2` to the two APIs.

## Notes (api1 + Postgres)

`smallfield.json` asks for one Postgres database, so a deploy gives `api1` a `DATABASE_URL`. `api1`
creates the `notes` table on start and serves `GET /notes` and `POST /notes` (`{"text":"first"}`).
Without `DATABASE_URL` it still starts, and `/notes` answers 503.

## SDK demo

The page shows the Small Field SDK at work:

- **Who am I**: the banner at the top comes from `@thesmallfield/web` `sf.identity.me()`.
- **Roles**: the line under it comes from `GET /api1/whoami`; `api1` reads the person with
  `sf.identity.fromRequest(req)` from `@thesmallfield/node` and returns `{ email, roles }`.
- **Health**: `GET /api1/health` answers `{"status":"ok"}` without a sign-in, because `smallfield.json`
  lists it under `public` for `api1`.
- **Upload a file**: `sf.files.upload(file, { onProgress })` sends the file straight from the browser to
  `files.<apps domain>` with a progress bar.
- **My files**: `sf.files.search({ owner: 'me', q })` lists your files. **Download** asks for a 5-minute link
  (`sf.files.link(id)`), **Delete** calls `sf.files.remove(id)`.
- **Send me an email**: the browser calls `POST /api1/email`; `api1` calls
  `sf.as(req).email.send({ Content })` from `@thesmallfield/node` with no `Destination`, so the email goes to
  the signed-in person. The page shows the `MessageId`. Browser code can never send email.

Turn on **Email** and **File service** for the project under **Capabilities** in the console, then redeploy.
Without them the page says which one to switch on.

### Where the SDK comes from

`api1` depends on `@thesmallfield/node` and `ui` on `@thesmallfield/web`, both from npm.
