import {createBrowserRouter} from "react-router-dom";
import Landing from "../components/Landing.tsx";
import SignUp from "../components/SignUp.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing/>,
    },
    {
        path: "/signup",
        element: <SignUp/>
    }
]);

export default router