import {Provider} from "react-redux";
import {store} from "../stores/store.ts";
import React from "react";

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({children}: AppProviderProps) => {
    return (
      <Provider store={store}>
          {children}
      </Provider>
    )
}

export default AppProvider