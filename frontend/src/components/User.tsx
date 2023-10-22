import UserPostList from "./UserPostList.tsx";
import { useParams } from "react-router-dom";

const User = () => {
  const {user_name} = useParams();
  if (user_name === undefined) {
    return <div>Error</div>
  }

  return (
    <div className="grid grid-cols-3">
      <div/>
      <UserPostList user_name={user_name}/>
      <div/>
    </div>
  )
}

export default User