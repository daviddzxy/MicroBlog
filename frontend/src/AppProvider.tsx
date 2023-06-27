import {Provider} from "react-redux";
import {store} from "./store/store.ts";
import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";

const AppProvider = () => {
    return (
      <Provider store={store}>
          <RouterProvider router={router}></RouterProvider>
      </Provider>
    )
}

export default AppProvider