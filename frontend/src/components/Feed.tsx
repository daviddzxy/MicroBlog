import {useInfiniteQuery} from "react-query";
import {fetchFollowersPosts} from "../services.ts";
import axios from "axios";
import Post from "./Post.tsx";

const Feed = () => {
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
    'follower_posts',
    ({pageParam}) => fetchFollowersPosts(pageParam), {
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
          {
            data?.pages.map(
              (posts) => posts.map((post) =>
                <Post {...post}/>
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

export default Feed