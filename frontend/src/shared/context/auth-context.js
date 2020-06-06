import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: "", //TODO
  userType: "", //admin, startup, student
  loginAsStudent: () => {},
  loginAsStartup: () => {},
  logout: () => {}
});
