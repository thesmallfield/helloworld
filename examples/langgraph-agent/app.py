import json
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse
from langchain_core.messages import AIMessageChunk
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

api = FastAPI()
page = Path(__file__).with_name("index.html").read_text()


@tool
def calculator(expression: str) -> str:
    """Evaluate a plain arithmetic expression such as '12 * 34 + 5'."""
    if not set(expression) <= set("0123456789+-*/(). ") or "**" in expression:
        return "Only numbers and + - * / ( ) are allowed."
    return str(eval(expression, {"__builtins__": {}}))


def build_graph():
    model = ChatOpenAI(model=os.environ.get("MODEL", "gpt-4o-mini")).bind_tools([calculator])

    def agent(state: MessagesState):
        return {"messages": [model.invoke(state["messages"])]}

    graph = StateGraph(MessagesState)
    graph.add_node("agent", agent)
    graph.add_node("tools", ToolNode([calculator]))
    graph.add_edge(START, "agent")
    graph.add_conditional_edges("agent", tools_condition)
    graph.add_edge("tools", "agent")
    return graph.compile()


class Chat(BaseModel):
    message: str


@api.get("/healthz", response_class=PlainTextResponse)
def healthz():
    return "ok"


@api.get("/", response_class=HTMLResponse)
def index():
    return page


@api.post("/chat")
async def chat(body: Chat):
    if not os.environ.get("OPENAI_API_KEY"):
        raise HTTPException(503, "OPENAI_API_KEY is not set. Run: sf secrets set OPENAI_API_KEY")
    graph = build_graph()

    async def tokens():
        async for chunk, _ in graph.astream({"messages": [("user", body.message)]}, stream_mode="messages"):
            if isinstance(chunk, AIMessageChunk) and chunk.content:
                yield {"data": json.dumps(chunk.content)}

    return EventSourceResponse(tokens())
