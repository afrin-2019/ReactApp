import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const AuthConsumer = AuthContext.Consumer;

export function useAuth() {
  return useContext(AuthContext);
}
