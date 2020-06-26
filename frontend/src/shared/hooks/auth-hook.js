import {useState, useCallback, useEffect} from "react";

let logoutTimer;

export const useAuth = () => { 
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);

  const login = useCallback((uid, uType, token, expirationDate) => {
    setUserId(uid);
    setUserType(userType);
    //either we already have one, or we create a new one
    const tokenExpirationDate = 
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //plus 1h
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
        "userData",
        JSON.stringify({
            userId: uid,
            userType: uType,
            token: token,
            expiration: tokenExpirationDate.toISOString(), //special toString => can be converted back to date
        })
    );
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setUserType(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);
  
  //auto logouts
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      //remainingTime calculated to be in miliseconds
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //auto logins
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date()
    ) {
        login(storedData.userId, storedData.userType, storedData.token, new Date(storedData.expiration));
    }
  }, [login]); //ensure this runs once
  //useEffect wrapped functions run after renders

  return { token, userId, login, logout };
}