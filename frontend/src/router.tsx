import {createBrowserRouter} from "react-router-dom";
import Landing from "./components/Landing.tsx";
import SignUp from "./components/SignUp.tsx";
import SignIn from "./components/SignIn.tsx";
import User from "./components/User.tsx";
import BaseLayout from "./components/BaseLayout.tsx";
import Feed from "./components/Feed.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing/>,
  },
  {
    path: "/signup",
    element: <SignUp/>
  },
  {
    path: "/signin",
    element: <SignIn/>
  },
  {
    path: "/feed",
    element: <BaseLayout content={<Feed/>}/>
  },
  {
    path: "/user/:userName",
    element: <BaseLayout content={<User/>}/>
  }
]);

export default router