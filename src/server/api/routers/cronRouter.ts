import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const cronRouter = createTRPCRouter({
  getCron: publicProcedure.query(async ({ ctx }) => {
    try {
      let res = await ctx.qstash.schedules.list();
      res = res.filter((s) => s.destination?.topic?.name === "election");
      if (res.length > 1) {
        throw new TRPCError({
          message: "Multiple crons found",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return res[0]?.cron || null;
    } catch (error) {
      throw new TRPCError({
        message: "Could not get crons",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  setCron: publicProcedure
    .input(
      z.object({
        cron: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("setCron", input);
      // Delete all schedules with topic "election"
      let res = await ctx.qstash.schedules.list();
      res = res.filter((s) => s.destination?.topic?.name === "election");
      for (const schedule of res) {
        await ctx.qstash.schedules.delete({ id: schedule.scheduleId });
      }

      // Create new schedule with topic election
      try {
        const { scheduleId } = await ctx.qstash.publish({
          topic: "election",
          cron: input.cron,
        });

        return scheduleId;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "Could not set cron",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  setScheduleToggle: publicProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      console.log("setScheduleToggle", input);
      try {
        await ctx.prisma.config.update({
          where: {
            id: 1,
          },
          data: {
            scheduleEnabled: input,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "Could not update",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getScheduleToggle: publicProcedure.query(async ({ ctx }) => {
    try {
      const config = await ctx.prisma.config.findFirst();
      return config?.scheduleEnabled || false;
    } catch (error) {
      throw new TRPCError({
        message: "Could not get config",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
