import React, { useContext } from 'react';

import { AuthContext } from '../../../shared/context/auth-context';

const STUDENT = {
    name: "test",
    profilePicture: "https://w0.pngwave.com/png/509/153/person-logo-computer-icons-others-png-clip-art.png", //should be url
    profileDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    challengeSubmissions: [//submissions will be populated with nested information
        "submission1", "submission2"
        /*
        {
            file: { type: String, required: true }, //should be url, pending expansion of functionality
            owner: { type: mongoose.Types.ObjectId, required: true, ref: "Student" },
            success: { type: Boolean, required: true } //keep track whether submission is correct without recompiling
        }
        */
    ],
    completedChallenges: [
        "c1", "c2"
    ],
    completedStartupChallenges: [
        "c1", "c2"
    ],
    email: "test@test.com",
    credentials: [//courses will be populated with nested information
        "course1", "course2" 
        /*
        {
          tier: { 
              type: mongoose.Types.ObjectId, 
              required: true, 
              ref: "Tier" 
          },
          language: {
              type: mongoose.Types.ObjectId,
              required: true,
              ref: "Language",
          },
          challenges: [
              { type: mongoose.Types.ObjectId, required: true, ref: "challenge" },
          ],
        } */
    ],
};

const StudentProfile = (props) => {
  const auth = useContext(AuthContext);

  //get startupid
  
  //todo: retrieve profile from backend

  if (auth.isLoggedIn && auth.userType === "student") {
      //render shit here
      /*ideally return that student's profile only*/
      return <h1> {STUDENT.toString()} </h1>;
      //can put todo pending token, then implement edit button here
  } else {
    return <h1>log in to find out more</h1>; 
    //render barebones information
  }
};

export default StudentProfile;
