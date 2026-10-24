# Examples

Each folder is a complete deploy root with its own `smallfield.json`. Run `sf deploy` inside it.

| Folder | Shape | Project |
| --- | --- | --- |
| plain-html | static, no build | sample-html |
| react-vite | React at `/`, Vue at `/admin` | sample-react |
| cra-style | static, `output: build` | sample-cra |
| next-export | Next.js static export | sample-next-export |
| next-server | Next.js server | sample-next |
| rooms | web + job that shares `orders.read` and `report` | rooms |
| python-hello | Python (Flask + gunicorn) | python-hello |
| langgraph-agent | Python LangGraph agent (FastAPI, SSE) | langgraph-agent |
| ai-sdk-agent | Node AI SDK agent (Hono, streamed text) | ai-sdk-agent |
| keras-classifier | Python Keras image classifier on CPU (FastAPI) | keras-classifier |
