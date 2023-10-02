import {Link} from "react-router-dom";

const linkClassName = "border-2 border-black hover:underline w-1/12 py-2 rounded-full"

const Landing = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center h-screen space-y-4">
      <h1 className="text-3xl font-semibold mb-4">MicroBlog</h1>
      <h2 className="text-xl mb-4">Join MicroBlog</h2>
      <Link to={"signup"} className={linkClassName}>Sign up</Link>
      <Link to={"signin"} className={linkClassName}>Sign in</Link>
    </div>
  )
}

export default Landing