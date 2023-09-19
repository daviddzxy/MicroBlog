import {useInfiniteQuery} from "react-query";
import {fetchFollowersPosts} from "../services.ts";
import axios from "axios";
import React from "react";

const PostList = () => {
  const {
    data,
    error,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching
  } = useInfiniteQuery(
    'posts',
    ({ pageParam }) => fetchFollowersPosts(pageParam), {
    getNextPageParam: (lastPage) => {
      return lastPage.length > 0 ? lastPage[lastPage.length - 1].id : undefined
    },
  })
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
    default:
      content = (
         <React.Fragment>
        <div>
          {data?.pages.map((posts) => posts.map((post) => <div key={post.id}>{post.user_name}: {post.content}</div>))}
        </div>
        <div>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
          </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
        </React.Fragment>
      )
  }

  return (
    <div>
      {content}
    </div>
  )
}

export default PostList