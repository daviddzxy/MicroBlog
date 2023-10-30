import {useParams} from "react-router-dom";
import UserPosts from "./UserPosts.tsx";
import UserProfile from "./UserProfile.tsx";

const User = () => {
  const {userName} = useParams();
  if (userName === undefined) {
    return <div>Error</div>
  }

  return (
    <div>
      <UserProfile userName={userName}/>
      <UserPosts userName={userName}/>
    </div>
  )
}

export default User