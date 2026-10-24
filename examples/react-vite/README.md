# react-vite (project `sample-react`)

Two single-page apps in one project.

- `web/` React + react-router, served at `/`. Built with pnpm (`pnpm-workspace.yaml` allows esbuild).
- `admin/` Vue + vue-router, served at `/admin`. Vite `base` is `/admin/` so assets load from
  `/admin/assets/...` (the prefix is stripped before nginx sees it).

    cd examples/react-vite && sf deploy

Check: `/orders/42` and `/admin/orders/7` survive a reload.
