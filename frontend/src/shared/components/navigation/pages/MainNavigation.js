import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../../UIElements/Backdrop';
import { useHttpClient } from '../../../hooks/http-hook';
import ErrorModal from '../../UIElements/ErrorModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';

import './MainNavigation.css';

import { AuthContext } from '../../../context/auth-context';

const MainNavigation = (props) => {
  const auth = useContext(AuthContext); //no tokens yet
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const [user, setUser] = useState();
  //console.log(auth);
  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  useEffect(() => {
    //useEffect doesnt like a async function
    const getUser = async (userType) => {
      try {
        if (userType) {
          //console.log(`${process.env.REACT_APP_BACKEND_URL}/${userType}/${auth.userId}`);
          const response = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/${userType}/${auth.userId}`
          );
          if (userType === 'student') {
            setUser(response.student);
          } else if (userType === 'startup') {
            //console.log(response);
            setUser(response.startup);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser(auth.userType);
  }, [sendRequest, auth.userId, auth.userType]);

  let titleBar; //hopefully can use user name to replace placeholder
  if (auth.token && user) {
    titleBar = (
      <h1 className='nav-title'> {`Welcome to Level Up, ${user.name}!`}</h1>
    );
  } else {
    titleBar = <h1 className='nav-title'>Welcome to Level Up!</h1>;
  }

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
          {/*render a loading spinner*/}
        </div>
      )}

      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className='main-navigation__drawer-nav'>
          <NavLinks />
        </nav>
      </SideDrawer>
      {!isLoading && (
        <MainHeader>
          <button
            className='main-navigation__menu-btn'
            onClick={openDrawerHandler}
          >
            <span />
            <span />
            <span />
          </button>
          <div
            style={{
              display: 'grid',
              margin: 'auto',
            }}
          >
            <div className='main-navigation__logo'>
              <Link to='/'>
                <img
                  src='https://image.flaticon.com/icons/svg/2285/2285537.svg'
                  alt='Logo'
                  height='112'
                  width='112'
                />
                {/* broken? */}
              </Link>
            </div>
            <div className='main-navigation__title'>
              {titleBar}
              <nav className='main-navigation__header-nav'>
                <NavLinks />
              </nav>
            </div>
          </div>
        </MainHeader>
      )}
    </>
  );
};

export default MainNavigation;
