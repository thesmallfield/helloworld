# cra-style (project `sample-cra`)

Mimics Create React App output without installing it: `build.mjs` writes `build/index.html` and
`build/static/js/main.1a2b3c.js`. The manifest sets `"output": "build"`.

    cd examples/cra-style && sf deploy

Check: `/static/js/main.1a2b3c.js` is 200.
