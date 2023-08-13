import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient()


const AppProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  )
}

export default AppProvider