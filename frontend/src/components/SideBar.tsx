import {Link} from "react-router-dom";

const SideBar = () => {
  return (
    <div className="flex flex-col text-2xl items-center py-4">
      <h1>MicroBlog</h1>
      <Link to={"/feed"} className="hover:underline">Feed</Link>
    </div>
  )
}

export default SideBar