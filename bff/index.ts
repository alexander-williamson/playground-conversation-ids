import axios from "axios";
import Koa from "koa";
import Router from "koa-router";
import { v4 } from "uuid";
import { LogInfo } from "./Logger";
import cors from "@koa/cors";

const app = new Koa();
const port = 3001;
const INTERNAL_API_BASE_URL = "http://localhost:3002";

// router

const router = new Router();
router.get("/v1/my/teams", async (ctx: Koa.Context, next: Koa.Next) => {
  const url = new URL("/v1/teams/find", INTERNAL_API_BASE_URL).href;
  const response = await axios({
    method: "POST",
    url: url,
    data: {
      ownerIds: ["b28fcf2b-8be2-47ca-a3b0-aeb5957d8c4b"],
    },
    headers: {
      "X-Conversation-ID": ctx.headers["X-Conversation-ID"],
      "X-Request-ID": v4(),
    },
  });
  ctx.body = response.data;
});

// app

app.use(cors());
app.use(router.allowedMethods());
app.use(router.routes());

app.use(cors());
app.use(async (ctx: Koa.Context, next: Koa.Next) => {
  const existing = ctx.header["X-Conversation-Id"];
  LogInfo(`X-Conversation-ID: ${existing}`, ctx);
  if (!existing) {
    // generate a new one
    LogInfo("Did not find a X-Conversation-ID, creating one", ctx);
    ctx.header["X-Conversation-ID"] = v4();
  }
  const value = ctx.header["X-Conversation-ID"];
  LogInfo(`X-Conversation-ID: ${value}`, ctx);
  await next();
});

app.listen(port, () => {
  console.log(`🚀 BFF running on port http://localhost:${port}/`);
});
