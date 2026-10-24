# langgraph-agent (project `langgraph-agent`)

A tiny LangGraph agent (one LLM node, one calculator tool) wrapped in FastAPI. `POST /chat` with
`{"message": "..."}` streams the answer as server-sent events, `/healthz` answers `ok`, and `/` is a
small page with a textbox. It uses OpenAI through `langchain-openai`; set `MODEL` to change the model
(default `gpt-4o-mini`).

Without a key, `/chat` answers 503 and everything else still works.

Deploy once so the project exists, set the key, then deploy again:

    cd examples/langgraph-agent
    sf deploy
    sf secrets set OPENAI_API_KEY
    sf deploy

Streams can run up to 1 hour.
