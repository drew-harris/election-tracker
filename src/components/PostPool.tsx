import { api } from "~/utils/api";
import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

const PostPool = () => {
  const { data: postPool } = api.posts.listPool.useQuery();
  const context = api.useContext();
  const [input, setInput] = useState("");
  const submitPostMutation = api.posts.addPool.useMutation({
    onSuccess(data) {
      context.posts.listPool.setData(undefined, (old) => [
        ...(old || []),
        data,
      ]);
    },
  });

  const submitPost = () => {
    if (!input) return;
    submitPostMutation.mutate({ content: input });
    setInput("");
  };

  const deletePostMutation = api.posts.removePool.useMutation({
    onError(error) {
      Sentry.captureException(error);
      alert("Error deleting message from pool");
    },
    onSuccess(data) {
      context.posts.listPool.setData(undefined, (old) => {
        return (old || []).filter((post) => post.id !== data.id);
      });
    },
  });

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex flex-col items-center justify-center gap-3">
        <textarea
          placeholder="Enter a message"
          className="border-2 border-black p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={submitPost}>Submit</button>
      </div>
      <div className="mb-2 text-xl font-bold">
        Upcoming messages (randomly chosen)
      </div>
      {postPool?.length === 0 && (
        <div>
          <div className="text-sm font-semibold">No messages</div>
        </div>
      )}
      <div>
        {postPool?.map((post) => (
          <div
            className="mb-3 flex items-center justify-between border-2 border-gray-200 p-3"
            key={post.id}
          >
            <div>{post.content}</div>
            <div
              onClick={() => deletePostMutation.mutate({ id: post.id })}
              className="cursor-pointer text-xs font-semibold"
            >
              REMOVE
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPool;
