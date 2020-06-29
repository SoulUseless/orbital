import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../../shared/components/formElements/Input';
import Button from '../../../shared/components/formElements/Button';
import Card from '../../../shared/components/UIElements/Card';
import ImageUpload from '../../../shared/components/formElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from '../../../shared/util/validators';
import { useForm } from '../../../shared/hooks/form-hook';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../../shared/context/auth-context";

import './StudentProfile.css';

const UpdateStudentProfile = () => {
  const [identifiedStudent, setIdentifiedStudent] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const studentId = useParams().studentId;
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      profilePicture: {
        value: null,
        isValid: false,
      },
      profileDescription: {
        value: null,
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const getStudent = async () => {
      try {
        const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/student/${studentId}`);
        setIdentifiedStudent(response.student);
        setFormData(
          {
            name: {
              value: response.student.name,
              isValid: true,
            },
            email: {
              value: response.student.email,
              isValid: true,
            },
            profilePicture: {
              value: response.student.profilePicture,
              isValid: true,
            },
            profileDescription: {
              value: response.student.profileDescription,
              isValid: true,
            },
            password: {
              value: "",
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.log(err);
      }
    }
    getStudent();
    
  }, [setFormData, studentId, sendRequest]);

  const submitStudentUpdateHandler = async (event) => {
    event.preventDefault();
    //console.log(formState.inputs);
    const formData = new FormData(); //default browser js
    formData.append("name", formState.inputs.name.value);
    formData.append("email", formState.inputs.email.value);
    formData.append("profileDescription", formState.inputs.profileDescription.value);
    formData.append("password", formState.inputs.password.value);
    formData.append("image", formState.inputs.profilePicture.value);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/student/${studentId}`, 
      "PATCH",
      formData,
      {
          Authorization: `Bearer ${auth.token}`
      });
      console.log("success");
      history.push(`/student/${auth.userId}`);

    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
      //loading screen
      return (
          <div className="center">
              <LoadingSpinner />
          </div>
      );
  } else if (!identifiedStudent && !error) {
      //no student found
      return (
          <div className="center">
              <Card>
                  <h2> No Student Found. </h2>
              </Card>
          </div>
      );
  } else {
    console.log(identifiedStudent);
      return (
          <>
              <ErrorModal error={error} onClear={errorHandler} />
              {!isLoading && identifiedStudent && (
                  <Card>
                      <form
                          className="place-form"
                          onSubmit={submitStudentUpdateHandler}
                      >
                          <Input
                              id="name"
                              element="input"
                              type="text"
                              label="Name"
                              validators={[VALIDATOR_REQUIRE()]}
                              errorText="Please enter a valid name."
                              onInput={inputHandler}
                              initialValue={identifiedStudent.name}
                              initialValid={true}
                          />
                          <Input
                              id="email"
                              element="input"
                              type="text"
                              label="E-Mail"
                              validators={[VALIDATOR_EMAIL()]}
                              errorText="Please enter a valid email address."
                              onInput={inputHandler}
                              initialValue={identifiedStudent.email}
                              initialValid={false}
                          />
                          <Input
                              id="profileDescription"
                              element="textarea"
                              label="Profile Description"
                              validators={[VALIDATOR_REQUIRE()]}
                              errorText="Please enter a valid description."
                              onInput={inputHandler}
                              initialValue={
                                  identifiedStudent.profileDescription
                              }
                              initialValid={true}
                          />
                          <ImageUpload
                              center
                              id="profilePicture"
                              onInput={inputHandler}
                              errorText="Please provide a profile picture."
                          />
                          {/*TODO: less stupid version of this */}
                          {/*maybe ask user to key in old password first and then key new password */}
                          <Input
                              element="input"
                              id="password"
                              type="text"
                              label="Password (Enter old password if wish to remain unchanged)"
                              validators={[VALIDATOR_MINLENGTH(5)]}
                              errorText="Please enter a valid password, at least 5 characters."
                              initialValue=""
                              onInput={inputHandler}
                          />
                          <Button type="submit" disabled={!formState.isValid}>
                              UPDATE PROFILE
                          </Button>
                      </form>
                  </Card>
              )}
          </>
      );
  }
};

export default UpdateStudentProfile;
