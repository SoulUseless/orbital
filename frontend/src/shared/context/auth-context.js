import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userType: "", //admin, startup, student
  loginAsStudent: () => {},
  loginAsStartup: () => {},
  logout: () => {}
});
