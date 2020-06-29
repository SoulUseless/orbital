import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../../shared/context/auth-context';
import Button from '../../../shared/components/formElements/Button';
import Card from '../../../shared/components/UIElements/Card';
import Avatar from '../../../shared/components/UIElements/Avatar';
import { useHttpClient } from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner"

import './StudentProfile.css';

const StudentProfile = (props) => {
  const auth = useContext(AuthContext);
  const studentId = useParams().studentId;
  const [student, setStudent] = useState();
  
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  useEffect(() => {
      //useEffect doesnt like a async function
      const getStudent = async () => {
          try {
              const response = await sendRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/student/${studentId}`
              );
              setStudent(response.student);
          } catch (err) {
              console.log(err);
          }
      };
      getStudent();
  }, [sendRequest, studentId]);

  console.log(student);
  return (
      <>
          <ErrorModal error={error} onClear={errorHandler} />
          {isLoading && (
              <div className="center">
                  <LoadingSpinner />
                  {/*render a loading spinner*/}
              </div>
          )}
          {!isLoading && student && (
              <Card className="student-profile__content">
                  <div className="student-profile__logo">
                      <Avatar
                          center
                          image={`${process.env.REACT_APP_ASSET_URL}/${student.profilePicture}`}
                          alt={student.name}
                      />
                  </div>
                  <div className="student-item__info">
                      <h1>{student.name}</h1>
                      <h2>{student.email}</h2>
                      <h3>{student.profileDescription}</h3>
                      {/*TO DO: PRINT OUT CHALLENGE ACCOMPLISHMENTS TOO*/}
                  </div>

                  {auth.token &&
                      auth.userType === "student" &&
                      auth.userId === student._id && (
                          <Button
                              to={`/student/edit/${student._id}`}
                              className="student-item__button"
                          >
                              EDIT
                          </Button>
                      )}
              </Card>
          )}
      </>
  );
};

export default StudentProfile;
