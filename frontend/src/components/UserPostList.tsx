import {useInfiniteQuery} from "react-query";
import {fetchUserPosts} from "../services.ts";
import axios from "axios";
import Post from "./Post.tsx";
import React from "react";
import UserBio from "./UserBio.tsx";

const UserPostList: React.FC<{user_name: string}> = ({user_name}) => {
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
    'user_posts',
    ({pageParam}) => fetchUserPosts(user_name, pageParam), {
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
        <div className="flex flex-col space-y-2 overflow-y-auto border-black">
          <UserBio userName={user_name}/>
          {
            data?.pages.map(
              (posts) => posts.map((post) =>
                <Post id={post.id} content={post.content} created_at={post.created_at} user_name={user_name}/>
              )
            )
          }
          <div>
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
    <div>
      {content}
    </div>
  )
}

export default UserPostList