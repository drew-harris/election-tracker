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
        return post;
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

  listPool: publicProcedure.query(async ({ ctx }) => {
    try {
      const pool = await ctx.prisma.templateMessage.findMany({
        orderBy: {
          submittedAt: "desc",
        },
      });
      return pool;
    } catch (error) {
      throw new TRPCError({
        message: "Could not get post pool",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  addPool: publicProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const pool = await ctx.prisma.templateMessage.create({
          data: {
            content: input.content,
          },
        });
        return pool;
      } catch (error) {
        throw new TRPCError({
          message: "Could not add to post pool",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  removePool: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const pool = await ctx.prisma.templateMessage.delete({
          where: {
            id: input.id,
          },
        });
        return pool;
      } catch (error) {
        throw new TRPCError({
          message: "Could not remove from post pool",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
