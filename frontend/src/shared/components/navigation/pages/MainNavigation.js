import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../../UIElements/Backdrop';
import './MainNavigation.css';

import {AuthContext} from "../../../context/auth-context";

const MainNavigation = (props) => {
    const auth = useContext(AuthContext); //no tokens yet
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    const openDrawerHandler = () => {
        setDrawerIsOpen(true);
    };

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false);
    };

    let titleBar; //hopefully can use user name to replace placeholder
    if (auth.isLoggedIn) {
        if (auth.userType === "student") {
            titleBar = (
                <h1 className="nav-title" style={{ textAlign: "center" }}>
                    Welcome to Level Up, ((student))!
                </h1>
            );
        } else {
            titleBar = (
                <h1 className="nav-title" style={{ textAlign: "center" }}>
                    Welcome to Level Up, ((startup))!
                </h1>
            );
        }
    } else {
        titleBar = (
            <h1 className="nav-title" style={{ textAlign: "center" }}>
                Welcome to Level Up!
            </h1>
        );
    }
    
    return (
        <React.Fragment>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
            <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>

            <MainHeader>
                <button
                    className="main-navigation__menu-btn"
                    onClick={openDrawerHandler}
                >
                    <span />
                    <span />
                    <span />
                </button>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 5fr",
                        gridGap: 20,
                    }}
                >
                    <div className="main-navigation__title">
                        <Link to="/">
                            <img
                                src="logo.png"
                                alt="Logo"
                                height="150"
                                width="150"
                            />
                            {/* broken? */}
                        </Link>
                    </div>
                    <div>
                        {titleBar}
                        <nav className="main-navigation__header-nav">
                            <NavLinks />
                        </nav>
                    </div>
                </div>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;
