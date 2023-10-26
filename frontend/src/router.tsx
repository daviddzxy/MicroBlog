import {createBrowserRouter} from "react-router-dom";
import Landing from "./components/Landing.tsx";
import SignUp from "./components/SignUp.tsx";
import SignIn from "./components/SignIn.tsx";
import Feed from "./components/Feed.tsx"
import User from "./components/User.tsx";

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
        element: <Feed/>
    },
    {
        path: "/user/:userName",
        element: <User/>
    }
]);

export default router