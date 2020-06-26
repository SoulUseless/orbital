import React, { useContext } from 'react';

import { AuthContext } from '../../../shared/context/auth-context';
import Button from '../../../shared/components/formElements/Button';
import Card from '../../../shared/components/UIElements/Card';
import Avatar from '../../../shared/components/UIElements/Avatar';

import './StudentProfile.css';

const STUDENT = {
  id: 'stu1',
  name: 'test',
  profilePicture:
    'https://w0.pngwave.com/png/509/153/person-logo-computer-icons-others-png-clip-art.png', //should be url
  profileDescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  challengeSubmissions: [
    //submissions will be populated with nested information
    'submission1',
    'submission2',
  ],
  completedChallenges: ['c1', 'c2'],
  completedstudentChallenges: ['c1', 'c2'],
  email: 'test@test.com',
  credentials: [
    //courses will be populated with nested information
    'course1',
    'course2',
  ],
};

const StudentProfile = (props) => {
  const auth = useContext(AuthContext);
  const editProfileHandler = (event) => {
    event.preventDefault();
    console.log('editing'); // send this to the backend!
  };

  //todo: retrieve profile from backend
  if (
    auth.isLoggedIn &&
    auth.userType === 'student'
    //&& auth.userId === STUDENT.id      //COMMENT OUT FIRST ELSE CANT SHOW
  ) {
    return (
      <form className='student-profile' onClick={editProfileHandler}>
        <Card className='student-profile__content'>
          {' '}
          {/*figure how to shift card to center*/}
          <div className='student-profile__logo'>
            <Avatar center image={STUDENT.profilePicture} alt={STUDENT.name} />
          </div>
          <div className='student-item__info'>
            <h1>{STUDENT.name}</h1>
            <h2>{STUDENT.email}</h2>
            <h3>{STUDENT.profileDescription}</h3>
            {/*TODO: PRINT OUT CHALLENGE ACCOMPLISHMENTS TOO*/}
          </div>
            <Button
              to={`/student/edit/${STUDENT.id}`}
              className='student-item__button'
            >
              EDIT
            </Button>
        </Card>
      </form>
    );
    //TO DO: PENDING TOKEN
  } else {
    return <h1>log in to find out more</h1>;
    //return barebones stuff here
  }
};

export default StudentProfile;
