import { type NextPage } from "next";
import Head from "next/head";
import type { RouterOutputs } from "../utils/api";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const mentions = api.mentions.recentMentions.useQuery();

  return (
    <>
      <Head>
        <title>Election Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-4">
        {mentions.data?.map((mention) => (
          <MentionCard key={mention.fizzId} mention={mention} />
        ))}
      </div>
    </>
  );
};

interface MentionCardProps {
  mention: RouterOutputs["mentions"]["recentMentions"][0];
}

export const MentionCard = ({ mention }: MentionCardProps) => {
  return (
    <div className="border-1 mb-3 border border-gray-800 p-3">
      <div>{mention.content}</div>
      <div>{mention.likes} Likes</div>
      <div className="text-xs">{mention.createdAt.toLocaleString()}</div>
    </div>
  );
};

export default Home;
