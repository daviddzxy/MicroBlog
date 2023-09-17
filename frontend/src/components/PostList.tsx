import {useQuery} from "react-query";
import {fetchFollowersPosts} from "../services.ts";
import axios from "axios";

const PostList = () => {
    const { isLoading, isError, data, error } = useQuery({queryKey: ["posts"], queryFn: fetchFollowersPosts})
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
      content = <div>{data?.map(post => (<div key={post.id}>{post.user_name}: {post.content}</div>))}</div>
  }

  return (
    <div>
      {content}
    </div>
  )
}

export default PostList