import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { messages } from "~/utils/messages";
import { makePost } from "~/utils/posts";

// Hook to update the latest session
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Making post");
  try {
    let item = messages[Math.floor(Math.random() * messages.length)];
    let alreadySent = true;

    while (alreadySent) {
      const match = await prisma.mention.findFirst({
        where: {
          content: {
            contains: item,
          },
        },
      });
      if (match) {
        item = messages[Math.floor(Math.random() * messages.length)];
      } else {
        alreadySent = false;
      }
    }
    if (!item) {
      return res.status(500).json({ error: "No Item" });
    }

    const mention = await makePost(item);

    return res.status(200).json({ mention });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error?.message || "There was an internal error" });
    } else {
      return res.status(500).json({ error: "There was an internal error" });
    }
  }
}
