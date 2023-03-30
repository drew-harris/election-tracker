import { type NextPage } from "next";
import Head from "next/head";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

const Summary: NextPage = () => {
  const { data, isLoading } = api.mentions.details.useQuery();

  return (
    <>
      <Head>
        <title>Election Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-4">
        {isLoading && <div>Loading...</div>}
        <div>Sentiment: Higher number is more positively referenced</div>
        <div>
          {data?.map((details) => (
            <DetailsCard key={details.person} details={details} />
          ))}
        </div>
      </div>
    </>
  );
};

interface DetailsCardProps {
  details: RouterOutputs["mentions"]["details"][0];
}

const DetailsCard = ({ details }: DetailsCardProps) => {
  return (
    <div className="border-1 m-2 border border-gray-800 p-3">
      <div className="text-xl font-bold">{details.person}</div>
      <div className="">{details.count} total posts</div>
      <div className="">{details.likes} total likes</div>
      {details?.sentiment && (
        <div className="">
          Average sentiment: {details?.sentiment.toString().substring(0, 5)}
        </div>
      )}
    </div>
  );
};

export default Summary;
