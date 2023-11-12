import {Link} from "react-router-dom";
import {useUser} from "../features/User.tsx";
const SideBar = () => {
  const {userName} = useUser()
  return (
    <div className="flex flex-col text-2xl items-center py-4">
      <h1>MicroBlog</h1>
      <Link to={"/post"} className="hover:underline">Post</Link>
      <Link to={"/feed"} className="hover:underline">Feed</Link>
      <Link to={`/user/${userName}`} className="hover:underline">MyBlog</Link>
    </div>
  )
}

export default SideBar