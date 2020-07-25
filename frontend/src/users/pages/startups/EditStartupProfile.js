import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../../shared/components/formElements/Input';
import Button from '../../../shared/components/formElements/Button';
import Card from '../../../shared/components/UIElements/Card';
import ImageUpload from '../../../shared/components/formElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from '../../../shared/util/validators';
import { useForm } from '../../../shared/hooks/form-hook';
import './StartupProfile.css';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../../shared/context/auth-context";

const EditStartupProfile = () => {
  const startupId = useParams().startupId;
  const [startup, setStartup] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      logo: {
        value: null,
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      description: {
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

  useEffect(() => {
    const getStartup = async () => {
      try {
        const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/startup/${startupId}`);
        console.log(response.startup);
        setStartup(response.startup);
        setFormData(
          {
            name: {
              value: response.startup.name,
              isValid: true,
            },
            logo: {
              value: response.startup.logo,
              isValid: true,
            },
            email: {
              value: response.startup.email,
              isValid: true,
            },
            description: {
              value: response.startup.description,
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
      getStartup();
  }, [setFormData, startupId, sendRequest]);

  const submitStartupUpdateHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(); //default browser js
    formData.append("name", formState.inputs.name.value);
    formData.append("email", formState.inputs.email.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("password", formState.inputs.password.value);
    formData.append("image", formState.inputs.logo.value);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/startup/${startupId}`, 
      "PATCH",
      formData,
      {
          Authorization: `Bearer ${auth.token}`
      });
      console.log("success");
      history.push(`/startup/${auth.userId}`);

    } catch (err) {
      console.log(err);
    }
  };

  console.log(formState.inputs);

  if (isLoading) {
    //loading screen
    return (
        <div className="center">
            <LoadingSpinner />
        </div>
    );
  } else if (!startup && !error) {
    //no student found
    return (
        <div className="center">
            <Card>
                <h2> No Startup Found. </h2>
            </Card>
        </div>
    );
  } else {
    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            {!isLoading && startup && (
                <div className="profile-form-container">
                    <Card className="profile-form">
                        <h2> Edit Profile </h2>
                        <hr />
                        <form onSubmit={submitStartupUpdateHandler}>
                            <Input
                                id="name"
                                type="text"
                                element="input"
                                label="Name of Startup"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a name."
                                initialValue={startup.name}
                                initialValidity={true}
                                onInput={inputHandler}
                            />
                            <Input
                                id="email"
                                type="text"
                                element="input"
                                label="Email of Startup"
                                validators={[VALIDATOR_EMAIL()]}
                                errorText="Please enter a valid email address."
                                initialValue={startup.email}
                                initialValidity={true}
                                onInput={inputHandler}
                            />
                            <ImageUpload
                                center
                                id="logo"
                                label="Startup Logo"
                                errorText="Please provide an image."
                                onInput={inputHandler}
                            />

                            <Input
                                id="description"
                                type="text"
                                element="textarea"
                                label="Profile Description"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a description."
                                initialValue={startup.description}
                                initialValidity={true}
                                onInput={inputHandler}
                            />
                          {/*TODO: less stupid version of this */}
                          {/*maybe ask user to key in old password first and then key new password */}
                            <Input
                                id="password"
                                type="password"
                                element="input"
                                label="Password (Enter old password if wish to remain unchanged)"
                                errorText="Please enter a password."
                                initialValidity={false}
                                onInput={inputHandler}
                            />

                            <Button type="submit" disabled={!formState.isValid}>
                                Update Changes
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
  }
};
export default EditStartupProfile;
