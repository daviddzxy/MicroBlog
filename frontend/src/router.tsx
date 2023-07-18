import {createBrowserRouter} from "react-router-dom";
import Landing from "./components/Landing.tsx";
import SignUp from "./components/SignUp.tsx";
import SignIn from "./components/SignIn.tsx";

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
    }
]);

export default router