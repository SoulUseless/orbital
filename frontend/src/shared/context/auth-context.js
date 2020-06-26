import { createContext } from 'react';

export const AuthContext = createContext({
  token: undefined,
  userId: "", //TODO
  //maybe need store completed tiers here
  userType: "", //admin, startup, student
  loginAsStudent: () => {},
  loginAsStartup: () => {},
  logout: () => {}
});
