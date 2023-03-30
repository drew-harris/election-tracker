import type { NextApiRequest, NextApiResponse } from "next";

// Hook to update the latest session
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Making post");
  try {
    return res.status(200).json({ msg: "skipped" });
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
