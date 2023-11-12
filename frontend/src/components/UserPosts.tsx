import { useInfiniteQuery } from "react-query";
import { fetchUserPosts } from "../services.ts";
import axios from "axios";
import UserPost from "./UserPost.tsx";
import React from "react";

const UserPosts: React.FC<{ userName: string }> = ({ userName }) => {
  const {
    data,
    error,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess
  } = useInfiniteQuery(
    "user_posts",
    ({ pageParam }) => fetchUserPosts(userName, pageParam), {
      getNextPageParam: (lastPage) => {
        return lastPage.length > 0 ? lastPage[lastPage.length - 1].id : undefined
      },
    }
  )

  let content;
  switch (true) {
    case isLoading:
      content = <p>Loading...</p>;
      break;
    case isError:
      if (axios.isAxiosError(error)) {
        content = <p>{error.response?.data.detail}</p>;
      }
      break;
    case isSuccess:
      content = (
        <div className="flex flex-col space-y-2 overflow-y-auto border-black divide-y">
          {
            data?.pages.map(
              (posts) => posts.map((post) =>
                <UserPost id={post.id} content={post.content} createdAt={post.createdAt} userName={userName}/>
              )
            )
          }
          <div className="py-2">
            {hasNextPage ?
              <button className="border-2 border-black py-2 px-4 rounded-full" onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}>
                <span className="hover:underline">Load More</span>
              </button> : null}
          </div>
        </div>
      )
      break;
  }

  return (
    <React.Fragment>
      {content}
    </React.Fragment>
  )
}

export default UserPosts