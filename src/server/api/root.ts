import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { mentionRouter } from "./routers/mentionRouter";
import { postRouter } from "./routers/postRouter";
import { cronRouter } from "./routers/cronRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  mentions: mentionRouter,
  posts: postRouter,
  crons: cronRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
