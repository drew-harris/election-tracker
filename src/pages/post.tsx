import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";
import { MentionCard } from ".";

const Summary: NextPage = () => {
  const [input, setInput] = useState("");
  const {
    data,
    isLoading,
    refetch: refetchPosts,
  } = api.posts.myPosts.useQuery();
  const postMutation = api.posts.makePost.useMutation({
    onMutate: () => {
      setInput("");
    },
    onSuccess: () => {
      refetchPosts();
    },
  });

  const makePost = () => {
    if (!input) return;
    if (postMutation.isLoading) return;
    if (postMutation.isError) return;
    postMutation.mutate({ content: input });
  };

  return (
    <>
      <Head>
        <title>Election Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-auto mt-3 flex flex-col items-center gap-3 ">
        <div className="font-bold">Make Post</div>
        <textarea
          className="border-1 border border-gray-800 p-2 "
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="block" onClick={makePost}>
          Submit
        </button>
      </div>
      <div>
        {isLoading && <div>Loading...</div>}
        {data?.map((mention) => (
          <MentionCard key={mention.fizzId} mention={mention} />
        ))}
      </div>
    </>
  );
};

export default Summary;
