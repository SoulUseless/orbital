import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';

const NavLinks = props => {

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/challenges" exact>
          Challenges
        </NavLink>
      </li>

      <li>
        <NavLink to="/startup-challenge" exact>
          Startup Challenges
        </NavLink>
      </li>

      <li>
        <NavLink to="/how-to" exact>
          How to Use
        </NavLink>
      </li>

    </ul>
  );
};

export default NavLinks;
