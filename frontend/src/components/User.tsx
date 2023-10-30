import UserPostList from "./UserPostList.tsx";
import {useParams} from "react-router-dom";

const User = () => {
  const {userName} = useParams();
  if (userName === undefined) {
    return <div>Error</div>
  }

  return (
    <div className="grid grid-cols-3">
      <div/>
      <UserPostList userName={userName}/>
      <div/>
    </div>
  )
}

export default User