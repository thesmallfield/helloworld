# ai-sdk-agent (project `ai-sdk-agent`)

A tiny Vercel AI SDK agent on Hono. `POST /api/chat` with `{"message": "..."}` streams the answer
as plain text (`streamText` with one calculator tool), `/healthz` answers `ok`, and `/` is a small
page with a textbox. It uses OpenAI; set `MODEL` to change the model (default `gpt-4o-mini`).

Without a key, `/api/chat` answers 503 and everything else still works.

Deploy once so the project exists, set the key, then deploy again:

    cd examples/ai-sdk-agent
    sf deploy
    sf secrets set OPENAI_API_KEY
    sf deploy

Streams can run up to 1 hour.
