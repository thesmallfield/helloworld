#!/bin/sh
# Packs the Small Field SDK from an api checkout into vendor/ (the SDK is not on npm yet).
# Usage: scripts/vendor-sdk.sh ../api   then: pnpm install
set -eu
api=$(cd "${1:?Give the path to an api checkout, e.g. scripts/vendor-sdk.sh ../api}" && pwd)
vendor=$(cd "$(dirname "$0")/.." && pwd)/vendor
rm -rf "$vendor"
mkdir -p "$vendor"
pnpm --dir "$api" install --frozen-lockfile
for name in contracts sdk-shared node web; do
    pnpm --dir "$api" --filter "@thesmallfield/$name" build
    (cd "$api/packages/$name" && pnpm pack --pack-destination "$vendor")
done
(cd "$api" && git rev-parse --short HEAD) > "$vendor/API_COMMIT"
ls "$vendor"
