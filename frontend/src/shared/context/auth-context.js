import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: "", //TODO
  //maybe need store completed tiers here
  userType: "", //admin, startup, student
  loginAsStudent: () => {},
  loginAsStartup: () => {},
  logout: () => {}
});
