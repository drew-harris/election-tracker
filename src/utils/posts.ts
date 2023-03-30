import type { Person, Prisma } from "@prisma/client";
import Sentiment from "sentiment";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { getAccessToken } from "./login";

export async function getPosts(token: string, startAfter?: string | undefined) {
  try {
    const body = JSON.stringify({
      data: {
        clientVersion: "1.12.12",
        excludedTopics: [],
        endpointFeedType: "getPostsByDate",
        startAfter: startAfter,
      },
    });

    console.log("BODY: ", body);
    const response = await fetch(
      "https://us-central1-buzz-3eeb8.cloudfunctions.net/feedMainEndpoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Firebase-AppCheck": env.APP_CHECK,
          "Firebase-Instance-ID-Token": env.INSTANCE_ID,
          Authorization: "Bearer " + token,
          "User-Agent":
            "FirebaseAuth.iOS/10.2.0 com.ashtoncofer.Buzz/1.12.12 iPhone/16.1 hw/iPhone13_3",
        },
        body: body,
      }
    );

    if (response.ok) {
      const json = await response.json();
      console.log(json);
      return json.result.posts as Post[];
    } else {
      console.error(await response.text());
      throw new Error("Failed to get posts");
    }
  } catch (error) {
    throw new Error("Failed to get posts");
  }
}

const matchers: {
  name: Person;
  matcher: RegExp;
}[] = [
  {
    name: "Tulsi",
    matcher: /\s*tulsi\s*/i,
  },
  {
    name: "Mir",
    matcher: /\s*mir\s*/i,
  },
  {
    name: "Alex",
    matcher: /\s*alex\s*/i,
  },
  {
    name: "Hope",
    matcher: /\s*hope\s*/i,
  },
  {
    name: "Joey",
    matcher: /\s*joey\s*/i,
  },
  {
    name: "Krish",
    matcher: /\s*krish\s*/i,
  },
  {
    name: "Dylan",
    matcher: /\s*dylan\s*/i,
  },
  {
    name: "Michael",
    matcher: /\s*michael\s*/i,
  },
  {
    name: "Faith",
    matcher: /\s*faith\s*/i,
  },
  {
    name: "Clayton",
    matcher: /\s*clayton\s*/i,
  },
];

interface Post {
  commentCount: number;
  communityID: string;
  date: number;
  defaultPseudonym: string;
  flair: string;
  isVerified: boolean;
  isDisliked: boolean;
  isLiked: boolean;
  isOwnPost: boolean;
  isSaved: boolean;
  likesMinusDislikes: number;
  mediaURL?: string;
  postID: string;
  pseudonym: string;
  text: string;
  topic: string;
}

interface PostWithData extends Post {
  person: Person;
  sentiment: number;
}

export function filterPosts(posts: Post[]) {
  const filteredPosts: PostWithData[] = [];
  const sentiment = new Sentiment();
  posts.forEach((post) => {
    if (post.text) {
      const match = matchers.find((matcher) => {
        return matcher.matcher.test(post.text);
      });
      if (match) {
        filteredPosts.push({
          ...post,
          person: match.name,
          sentiment: sentiment.analyze(post.text).score,
        });
      }
    }
  });
  return filteredPosts;
}

export async function savePosts(posts: PostWithData[]) {
  try {
    const mapped: Prisma.MentionCreateManyInput[] = posts.map((p) => {
      return {
        sentiment: p.sentiment,
        fizzId: p.postID,
        person: p.person,
        content: p.text,
        likes: p.likesMinusDislikes,
        postedByMe: p.isOwnPost,
      };
    });
    const created = await prisma.mention.createMany({
      data: mapped,
      skipDuplicates: true,
    });

    const updates: Prisma.MentionUpdateInput[] = posts.map((p) => {
      return {
        fizzId: p.postID,
        likes: p.likesMinusDislikes,
        updatedAt: new Date(),
      };
    });

    console.log("UPDATES: ", updates);

    const promises = new Array<Promise<any>>(updates.length);
    for (const update of updates) {
      if (!update.fizzId || typeof update.fizzId != "string") continue;
      const prom = prisma.mention.update({
        where: {
          fizzId: update.fizzId,
        },
        data: update,
      });
      promises.push(prom);
    }

    await Promise.all(promises);

    // Update the new ones

    return mapped;
  } catch (error) {}
}

export async function makePost(content: string) {
  const token = await getAccessToken();
  try {
    const body = JSON.stringify({
      data: {
        clientVersion: "1.12.12",
        pseudonym: "",
        linkURL: null,
        pollOptions: null,
        postType: "text",
        text: content,
        usingLeaderBoardName: false,
        topic: "general",
        pinTopOfFizzin: true,
        flair: "",
      },
    });

    console.log("BODY: ", body);
    const response = await fetch(
      "https://us-central1-buzz-3eeb8.cloudfunctions.net/createPost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Firebase-AppCheck": env.APP_CHECK,
          "Firebase-Instance-ID-Token": env.INSTANCE_ID,
          Authorization: "Bearer " + token,
          "User-Agent":
            "FirebaseAuth.iOS/10.2.0 com.ashtoncofer.Buzz/1.12.12 iPhone/16.1 hw/iPhone13_3",
        },
        body: body,
      }
    );

    if (!response.ok) {
      console.error(await response.text());
      throw new Error("Failed to make post");
    }

    const data = await response.json();
    return data.result as Post;
  } catch (error) {
    throw new Error("Failed to get posts");
  }
}
