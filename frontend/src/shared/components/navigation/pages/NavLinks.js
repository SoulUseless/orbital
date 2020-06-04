import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';

const NavLinks = props => {

  return (
    <>
      <ul className="nav-links">
        <li>
          <NavLink to="/challenges" exact>
            <span style={{color: "white"}}> Challenges </span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/startup-challenge" exact>
          <span style={{color: "white"}}> Startup Challenges </span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/how-to" exact>
          <span style={{color: "white"}}> How to Use </span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/auth" exact>
          <span style={{color: "white"}}> Authenticate </span>
          </NavLink>
        </li>
      </ul>
    </>
  );
};

export default NavLinks;
