import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "~/utils/login";
import { filterPosts, getPosts, savePosts } from "~/utils/posts";

// Hook to update the latest session
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("UPDATE!!!");
  // get the first user
  try {
    // Get the newest credentials
    // Get the newest posts
    const creds = await getAccessToken();
    console.log(creds);
    const posts = await getPosts(creds);
    const filtered = filterPosts(posts);
    const created = await savePosts(filtered);

    return res.status(200).json(created);
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
