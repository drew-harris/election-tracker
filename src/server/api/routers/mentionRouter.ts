import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAccessToken } from "~/utils/login";
import { getPosts } from "~/utils/posts";

export const mentionRouter = createTRPCRouter({
  recentMentions: publicProcedure.query(async ({ ctx }) => {
    try {
      const token = await getAccessToken();
      const posts = await ctx.prisma.mention.findMany({});
      return posts;
    } catch (error) {
      throw new TRPCError({
        message: "Could not get recent mentions",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
