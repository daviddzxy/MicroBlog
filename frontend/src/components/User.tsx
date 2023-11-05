import UserProfile from "./UserProfile.tsx";
import UserPosts from "./UserPosts.tsx";
import {useOutletContext} from "react-router-dom";

const User = () => {
  const userName = useOutletContext<string>();

  return (
    <div>
      <UserProfile userName={userName}/>
      <UserPosts userName={userName}/>
    </div>
  )
}

export default User