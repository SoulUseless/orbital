import React, { useContext } from 'react';

import StudentList from '../../components/students/StudentList';
import { AuthContext } from '../../../shared/context/auth-context';

const StudentProfiles = () => {
  const auth = useContext(AuthContext);

  const STUDENTS = [
    {
      id: 'u1',
      name: 'Max Schwarz',
      email: 'max@max.com',
      image:
        'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      password: '123456',
    },
  ];
  if (auth.isLoggedIn) {
    {
      /*TO DO: only be able to see their own profile*/
    }
    return <StudentList items={STUDENTS} />;
    {
      /*ideally return that student's profile only*/
    }
  } else {
    return <h1>log in to find out more</h1>;
  }
};

export default StudentProfiles;
