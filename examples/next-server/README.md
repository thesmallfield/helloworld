# next-server (project `sample-next`)

Next.js server (`next build` + `next start`) as a `web` component at `/`, with an API route at
`/api/hello` and a server component reading `GREETING`.

    cd examples/next-server && sf deploy

Check: `/api/hello` returns `{"message":"hello from next"}`.
Note: use `images.unoptimized` (the pod file system is read-only, so no image cache).
