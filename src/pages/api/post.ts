import type { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "~/server/db";
import { makePost } from "~/utils/posts";

// Hook to update the latest session
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Making post");
  try {
    const config = await prisma.config.findFirst();
    if (!config || !config?.scheduleEnabled) {
      return res.status(200).json({ msg: "Posting disabled" });
    }
    const firstPotential = await prisma.templateMessage.findFirst({
      orderBy: {
        submittedAt: "desc",
      },
    });
    if (!firstPotential) {
      Sentry.captureMessage("No potential messages");
      return res.status(200).json({ msg: "No More Messages" });
    }

    const mention = await makePost(firstPotential?.content);

    // Delete the message
    await prisma.templateMessage.delete({
      where: {
        id: firstPotential.id,
      },
    });

    return res.status(200).json({ mention });
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error?.message || "There was an internal error" });
    } else {
      return res.status(500).json({ error: "There was an internal error" });
    }
  }
}
