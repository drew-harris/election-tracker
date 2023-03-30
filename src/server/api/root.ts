import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { mentionRouter } from "./routers/mentionRouter";
import { postRouter } from "./routers/postRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  mentions: mentionRouter,
  posts: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
