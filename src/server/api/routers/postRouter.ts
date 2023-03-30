import { TRPCError } from "@trpc/server";
import Sentiment from "sentiment";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { makePost } from "~/utils/posts";

export const postRouter = createTRPCRouter({
  makePost: publicProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sentiment = new Sentiment();
      try {
        const post = await makePost(input.content);
        const created = await ctx.prisma.mention.create({
          data: {
            fizzId: post.postID,
            content: post.text,
            person: "Faith",
            sentiment: sentiment.analyze(post.text).score,
            likes: 0,
            postedByMe: true,
          },
        });
        return created;
      } catch (error) {
        throw new TRPCError({
          message: "Could not make post",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  myPosts: publicProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.prisma.mention.findMany({
        where: {
          postedByMe: true,
        },
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
});
