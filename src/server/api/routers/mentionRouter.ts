import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mentionRouter = createTRPCRouter({
  recentMentions: publicProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.prisma.mention.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return posts;
    } catch (error) {
      throw new TRPCError({
        message: "Could not get recent mentions",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  details: publicProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.prisma.mention.groupBy({
        by: ["person"],
        _count: {
          _all: true,
        },
        _sum: {
          likes: true,
        },
        _avg: {
          sentiment: true,
        },
      });
      return posts.map((post) => ({
        person: post.person,
        count: post._count._all,
        likes: post._sum.likes,
        sentiment: post._avg.sentiment,
      }));
    } catch (error) {
      throw new TRPCError({
        message: "Could not get recent mentions",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
