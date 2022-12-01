import React, {  useEffect, useReducer } from "react";

import initialState from "./InitialState";
import { reducer } from "./UserReducer";

import cma from "../../api/management_api";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    //console.log("Checking user is authenticated");
  }, []);

  const signOut = async () => {
    dispatch({ type: "SIGN_OUT" });
  };

  const signIn = async () => {
    const userSession = await cma.getToken();
    dispatch({ type: "SIGN_IN", payload :userSession });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        signIn,
        signOut,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };