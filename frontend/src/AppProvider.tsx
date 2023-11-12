import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from 'react-query/devtools';
import {UserProvider} from "./features/User.tsx";


const queryClient = new QueryClient()


const AppProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router}/>
        <ReactQueryDevtools initialIsOpen={false}/>
      </UserProvider>
    </QueryClientProvider>
  )
}

export default AppProvider