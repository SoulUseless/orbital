import React, { useState, useContext } from 'react';

import Card from '../../../shared/components/UIElements/Card';
import Input from '../../../shared/components/formElements/Input';
import Button from '../../../shared/components/formElements/Button';
import ImageUpload from '../../../shared/components/formElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../../shared/util/validators';
import { useForm } from '../../../shared/hooks/form-hook';
import { AuthContext } from '../../../shared/context/auth-context';
import { useHttpClient } from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import './Auth.css';

const Auth = (props) => {
  //return <h1> Auth </h1>;
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userType, setUserType] = useState('Student');
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const switchUserType = () => {
    if (userType === 'Student') {
      setUserType('Startup');
    } else {
      setUserType('Student');
    }
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLoginMode) {
        //log in
        if (userType === "Student") {
            let responseData;
            try {
                //this one to catch whether the log in is successful
                responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/student/login",
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        "Content-Type": "application/json", //configure type of request to json
                    }
                );
                console.log(responseData);
                auth.loginAsStudent(responseData.userId, responseData.token);
            } catch (err) {
                console.log(err);
                //just to stop the function when an error happens
            }
        } else {
            let responseData;
            try {
                //this one to catch whether the log in is successful
                responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/startup/login",
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        "Content-Type": "application/json", //configure type of request to json
                    }
                );
                auth.loginAsStartup(responseData.userId, responseData.token);
            } catch (err) {
                console.log(err);
                //just to stop the function when an error happens
            }
        }
    } else {
        //signup
        let responseData;
        const formData = new FormData(); //default browser js
        formData.append("email", formState.inputs.email.value); //formData accepts all datatypes
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value); //images are accepted also

        if (userType === "Student") {
            try {
                responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/student/signup",
                    "POST",
                    formData //headers are set automatically using fetch under the hood
                );
                auth.loginAsStudent(responseData.userId, responseData.token);
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/startup/signup",
                    "POST",
                    formData //headers are set automatically using fetch under the hood
                );
                auth.loginAsStartup(responseData.userId, responseData.token);
            } catch (err) {
                console.log(err);
            }
        }
    }
  }

  return (
      <>
          <ErrorModal error={error} onClear={errorHandler} />
          <Card className="authentication">
              {
                  isLoading && (
                      <LoadingSpinner asOverlay />
                  ) /*render a loading spinner*/
              }
              {isLoginMode && <h2>Login as {userType}</h2>}
              {!isLoginMode && <h2> Signup as {userType} </h2>}
              <hr />
              <form onSubmit={authSubmitHandler}>
                  {!isLoginMode && (
                      <Input
                          element="input"
                          id="name"
                          type="text"
                          label="Your Name"
                          validators={[VALIDATOR_REQUIRE()]}
                          errorText="Please enter a name."
                          onInput={inputHandler}
                      />
                  )}
                  {!isLoginMode && (
                      <ImageUpload
                          center
                          id="image"
                          onInput={inputHandler}
                          errorText="Please provide an image."
                      />
                  )}
                  <Input
                      element="input"
                      id="email"
                      type="email"
                      label="E-Mail"
                      validators={[VALIDATOR_EMAIL()]}
                      errorText="Please enter a valid email address."
                      onInput={inputHandler}
                  />
                  <Input
                      element="input"
                      id="password"
                      type="password"
                      label="Password"
                      validators={[VALIDATOR_MINLENGTH(5)]}
                      errorText="Please enter a valid password, at least 5 characters."
                      onInput={inputHandler}
                  />
                  <Button type="submit" disabled={!formState.isValid}>
                      {isLoginMode ? "LOGIN" : "SIGNUP"}
                  </Button>
              </form>

              <Button inverse onClick={switchUserType}>
                  {isLoginMode ? "Login" : "Signup"} As:{" "}
                  {userType === "Student" ? "Startup" : "Student"}
              </Button>

              <Button inverse onClick={switchModeHandler}>
                  Click here to {isLoginMode ? "Signup" : "Login"}
              </Button>
          </Card>
      </>
  );
};

export default Auth;
