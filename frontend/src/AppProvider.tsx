import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";

const AppProvider = () => {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default AppProvider