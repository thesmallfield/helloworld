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

The SDK is not on npm yet, and the Small Field build cannot sign in to GitHub Packages. So the packed SDK
lives in `vendor/` (`contracts`, `sdk-shared`, `node`, `web`; `vendor/API_COMMIT` says which `api` commit) and
`api1` and `ui` depend on it with `file:` paths. To update it:

```sh
scripts/vendor-sdk.sh ../api   # packs the SDK from an api checkout into vendor/
pnpm install                   # updates pnpm-lock.yaml
```

When the SDK is on npm, swap the `file:` paths for the version and delete `vendor/` and the `overrides` in
`pnpm-workspace.yaml`.
