import {Provider} from "react-redux";
import {store} from "../stores/store.ts";
import {RouterProvider} from "react-router-dom";
import router from "../routes/router.tsx";

const AppProvider = () => {
    return (
      <Provider store={store}>
          <RouterProvider router={router}></RouterProvider>
      </Provider>
    )
}

export default AppProvider