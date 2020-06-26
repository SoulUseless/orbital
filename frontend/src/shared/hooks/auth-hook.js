import {useState, useCallback, useEffect} from "react";

let logoutTimer;

export const useAuth = () => { 
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);

  const loginAsStudent = useCallback((uid, token, expirationDate) => {
      console.log("trig");
      setUserId(uid);
      setUserType("student");
      //either we already have one, or we create a new one
      const tokenExpirationDate =
          expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //plus 1h
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
          "userData",
          JSON.stringify({
              userId: uid,
              userType: "student",
              token: token,
              expiration: tokenExpirationDate.toISOString(), //special toString => can be converted back to date
          })
      );
      setToken(token);
  }, []);

  const loginAsStartup = useCallback((uid, token, expirationDate) => {
      setUserId(uid);
      setUserType("startup");
      //either we already have one, or we create a new one
      const tokenExpirationDate =
          expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //plus 1h
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
          "userData",
          JSON.stringify({
              userId: uid,
              userType: "startup",
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
        if (storedData.userType === "student") {
            loginAsStudent(storedData.userId, storedData.token, new Date(storedData.expiration));
        } else { //startup
            loginAsStartup(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
        
    }
  }, [loginAsStudent, loginAsStartup]); //ensure this runs once
  //useEffect wrapped functions run after renders

  return { token, userId, userType, loginAsStudent, loginAsStartup, logout };
}