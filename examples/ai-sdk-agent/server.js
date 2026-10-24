import { readFileSync } from "node:fs";
import { serve } from "@hono/node-server";
import { openai } from "@ai-sdk/openai";
import { stepCountIs, streamText, tool } from "ai";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();
const page = readFileSync(new URL("./index.html", import.meta.url), "utf8");

const calculator = tool({
    description: "Evaluate a plain arithmetic expression such as '12 * 34 + 5'.",
    inputSchema: z.object({ expression: z.string() }),
    execute: async ({ expression }) => {
        if (!/^[0-9+\-*/(). ]+$/.test(expression) || expression.includes("**")) return "Only numbers and + - * / ( ) are allowed.";
        return String(Function(`"use strict"; return (${expression})`)());
    },
});

app.get("/healthz", (c) => c.text("ok"));
app.get("/", (c) => c.html(page));

app.post("/api/chat", async (c) => {
    if (!process.env.OPENAI_API_KEY) {
        return c.text("OPENAI_API_KEY is not set. Run: sf secrets set OPENAI_API_KEY", 503);
    }
    const { message } = await c.req.json();
    const result = streamText({
        model: openai(process.env.MODEL ?? "gpt-4o-mini"),
        prompt: message,
        tools: { calculator },
        stopWhen: stepCountIs(5),
    });
    return result.toTextStreamResponse({
        headers: { "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
    });
});

serve({ fetch: app.fetch, port: Number(process.env.PORT ?? 8080) });
