import React from 'react';

import StudentList from '../../components/students/StudentList';

const DUMMY_STUDENTS = [
  {
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
    completedStartupChallenges: ['c1', 'c2'],
    email: 'test@test.com',
    credentials: [
      //courses will be populated with nested information
      'course1',
      'course2',
    ],
  },
  {
    id: 'stu2',

    name: 'test2',
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
    completedStartupChallenges: ['c1', 'c2'],
    email: 'test@test.com',
    credentials: [
      //courses will be populated with nested information
      'course1',
      'course2',
    ],
  },
  {
    id: 'stu3',
    name: 'test3',
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
    completedStartupChallenges: ['c1', 'c2'],
    email: 'test@test.com',
    credentials: [
      //courses will be populated with nested information
      'course1',
      'course2',
    ],
  },
];
const Students = (props) => {
  return <StudentList items={DUMMY_STUDENTS} />;
};

export default Students;
