import React, { useContext } from 'react';

import StartupList from '../../components/startups/StartupList';
import { AuthContext } from '../../../shared/context/auth-context';

const StartupProfiles = () => {
  const auth = useContext(AuthContext);

  const STARTUPS = [
    {
      id: 's1',
      name: 'startup',
      email: 'startup@123.com',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      password: '123456',
    },
  ];

  if (auth.isLoggedIn) {
    {
      /*TO DO: only be able to see their own profile*/
    }
    return <StartupList items={STARTUPS} />;
    {
      /*ideally return that student's profile only*/
    }
  } else {
    return <h1>log in to find out more</h1>;
  }
};

export default StartupProfiles;
