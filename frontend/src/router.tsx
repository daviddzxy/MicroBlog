import {createBrowserRouter} from "react-router-dom";
import Landing from "./components/Landing.tsx";
import SignUp from "./components/SignUp.tsx";
import SignIn from "./components/SignIn.tsx";
import UserRoot from "./components/UserRoot.tsx";
import BaseLayout from "./components/BaseLayout.tsx";
import Feed from "./components/Feed.tsx";
import Followers from "./components/Followers.tsx";
import User from "./components/User.tsx";
import Following from "./components/Following.tsx";
import SideBar from "./components/SideBar.tsx";
import Post from "./components/Post.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing/>,
  },
  {
    path: "signup",
    element: <SignUp/>
  },
  {
    path: "signin",
    element: <SignIn/>
  },
  {
    path: "feed",
    element: <BaseLayout content={<Feed/>} sideBar={<SideBar/>}/>
  },
    {
    path: "post",
    element: <BaseLayout content={<Post/>} sideBar={<SideBar/>}/>
  },
  {
    path: "user/:userName",
    element: <BaseLayout content={<UserRoot/>} sideBar={<SideBar/>}/>,
    children: [
      {
        path: "",
        element: <User/>
      },
      {
        path: "followers",
        element: <Followers/>
      },
      {
        path: "following",
        element: <Following/>
      }
    ]
  }
]);

export default router