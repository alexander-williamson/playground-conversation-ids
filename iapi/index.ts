import axios from "axios";
import Koa from "koa";
import Router from "koa-router";
import { v4 } from "uuid";
import { LogInfo } from "./Logger";

const app = new Koa();
const port = 3002;

// router

const router = new Router();
router.post("/v1/teams/find", async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.body = {
    data: [
      {
        id: "team-1",
        name: "Team One",
        ownerId: "example-owner-1",
      },
    ],
  };
});

// app

app.use(router.allowedMethods());
app.use(router.routes());

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
