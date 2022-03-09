import { createContext, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [socket, setSocket] = useState(null);
  const [registerSucess, setRegisterSucess] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser: state.currentUser,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        socket,
        setSocket,
        registerSucess,
        setRegisterSucess,
      }}
    >
      {children}
    </AuthContext.Provider>
    // Context.Provider就是提供props
  );
};
