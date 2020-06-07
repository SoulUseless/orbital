import React, { useContext } from "react";
import { NavLink } from 'react-router-dom';
import { AuthContext } from "../../../context/auth-context";

import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return (
      <>
          <ul className="nav-links">
              <li>
                  <NavLink to="/challenges" exact>
                      <span style={{ color: "white" }}> Challenges </span>
                  </NavLink>
              </li>

              <li>
                  <NavLink to="/startup-challenge" exact>
                      <span style={{ color: "white" }}>
                          {" "}
                          Startup Challenges{" "}
                      </span>
                  </NavLink>
              </li>

              <li>
                  <NavLink to="/how-to" exact>
                      <span style={{ color: "white" }}> How to Use </span>
                  </NavLink>
              </li>

              {!auth.isLoggedIn && (
                  <li>
                      <NavLink to="/auth" exact>
                          <span style={{ color: "white" }}> Authenticate </span>
                      </NavLink>
                  </li>
              )}

              {auth.isLoggedIn && (
                  <>
                      <li>
                          <NavLink to="/auth" exact> {/** to do */}
                              <span style={{ color: "white" }}>
                                  My Profile
                              </span>
                          </NavLink>
                      </li>
                      <li>
                          <NavLink to="/auth" exact> {/* to do*/}
                              <span style={{ color: "white" }}>
                                  Settings
                              </span>
                          </NavLink>
                      </li>
                      <li>
                        <button onClick={auth.logout}> Logout </button>
                      </li>
                  </>
              )}
          </ul>
      </>
  );
};

export default NavLinks;
