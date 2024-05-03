import Koa from "koa";

export function LogInfo(payload: string, ctx: Koa.Context) {
  const metadata = {
    "X-Conversation-ID": ctx.header["X-Conversation-ID"],
    "X-Request-ID": ctx.header["X-Request-ID"],
  };
  console.info(payload, metadata);
}
