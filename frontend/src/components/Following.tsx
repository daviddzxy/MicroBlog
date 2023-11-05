import React from "react";
import {Link, useOutletContext} from "react-router-dom";
import {useInfiniteQuery} from "react-query";
import {fetchFollowing} from "../services.ts";
import axios from "axios";
import Follow from "./Follow.tsx";

const Following = () => {
  const userName = useOutletContext<string>();

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
    ["user", userName, "followers"],
    ({pageParam}) => fetchFollowing(userName, pageParam), {
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
          <div className="text-3xl">Followed users of <Link className="hover:underline" to={`/user/${userName}`}>{userName}</Link></div>
          {
            data?.pages.map(
              (posts) => posts.map((follow) =>
                <Follow {...follow}/>
              )
            )
          }
          <div className="py-2">
            {hasNextPage ?
              <button className="border-2 border-black py-2 px-4 rounded-full" onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}>
                <span className="hover:underline">Load More</span>
              </button> : null
            }
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

export default Following