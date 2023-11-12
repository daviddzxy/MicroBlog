import React, {createContext, useContext, useState} from "react";

export type userContextType = {
  userName: string | null
  setUserName: (userName: string) => void
};


export const UserContext = createContext<userContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode}> = ({children}) => {
  const [userName, setUserName] = useState<userContextType["userName"]>(null)
  return <UserContext.Provider value={{userName, setUserName}}>
    {children}
  </UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext has not been created");
  }
  return context
};
