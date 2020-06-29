import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/formElements/Input';
import Button from '../../shared/components/formElements/Button';
import Card from '../../shared/components/UIElements/Card';
import MultiDropdown from '../../shared/components/formElements/MultiDropdown';
import FileUpload from '../../shared/components/formElements/FileUpload';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { AuthContext } from '../../shared/context/auth-context';

const EditStartupChallenge = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const challengeId = useParams().challengeId;
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      requirements: {
        value: [],
        isValid: true,
      },
      taskDescription: {
        value: '',
        isValid: false,
      },
      testCases: {
        value: { privateTestCases: [], publicTestCases: [] },
        isValid: false,
      },
    },
    false
  );

  
  const [challenge, setChallenge] = useState();
  const [allLanguages, setLanguages] = useState();
  const [allTiers, setTiers] = useState();

  useEffect(() => {
    const getChallenge = async () => {
        try {
            const response = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/startup-challenge/${challengeId}`
            );
            setChallenge(response.challenge);
            //console.log(response.challenge);
            setFormData(
                {
                    name: {
                        value: response.challenge.name,
                        isValid: true,
                    },
                    description: {
                        value: response.challenge.description,
                        isValid: true,
                    },
                    requirements: {
                        value: response.challenge.requirements.map((req) => {
                            return {
                                language: req.language.name,
                                tier: req.tier.name,
                            };
                        }),
                        isValid: true,
                    },
                    taskDescription: {
                        value: response.challenge.taskDescription,
                        isValid: true,
                    },
                    testCases: {
                        value: response.challenge.testCases,
                        isValid: true,
                    },
                },
                true
            );
        } catch (err) {
            console.log(err);
        }
    };

    const getLanguages = async () => {
      try {
          const response = await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/language`
          );
          setLanguages(response.languages.map((lang) => lang.name));
      } catch (err) {
          console.log(err);
      }
    };
    getLanguages();

    const getTiers = async () => {
      try {
          const response = await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/tier`
          );
          setTiers(response.tiers.map((t) => t.name));
      } catch (err) {
          console.log(err);
      }
    };
    getTiers();
    getChallenge();
  }, [setFormData, sendRequest, challengeId]);

  const submitUpdateChallengeHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/startup-challenge/${challengeId}`, 
      "PATCH",
      JSON.stringify({
        name: formState.inputs.name.value,
        description: formState.inputs.description.value,
        requirements: formState.inputs.requirements.value,
        taskDescription: formState.inputs.taskDescription.value,
        testCases: formState.inputs.testCases.value,
      }),
      {
        "Content-Type": "application/json",  
        Authorization: `Bearer ${auth.token}`
      });
      console.log("success");
      history.push(`/startup-challenge/${challengeId}`);

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
  } else if (!challenge && !error) {
      //no startup challenge found
      return (
          <div className="center">
              <Card>
                  <h2> No Challenge Found. </h2>
              </Card>
          </div>
      );
  } else {
    return (
        //initial render has problems, all inputs set to false by default somehow
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            {!isLoading && challenge && allLanguages && allTiers && (
                <div className="challenge-form-container">
                    <Card className="challenge-form">
                        <h2> Edit Challenge </h2>
                        <hr />
                        <form onSubmit={submitUpdateChallengeHandler}>
                            <Input
                                element="input"
                                id="name"
                                type="text"
                                label="Name of Challenge"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a name."
                                initialValue={challenge.name}
                                initialValidity={true}
                                onInput={inputHandler}
                            />

                            <Input
                                id="description"
                                type="text"
                                label="Brief Description of Challenge"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a description."
                                initialValue={challenge.description}
                                initialValidity={true}
                                onInput={inputHandler}
                            />

                            <MultiDropdown
                                element="input"
                                id="requirements"
                                options={[allLanguages, allTiers]}
                                label="Requirements of Challenge"
                                errorText="Please enter at least one requirement."
                                initialValue={challenge.requirements.map(
                                    (req) => {
                                        return {
                                            language: req.language.name,
                                            tier: req.tier.name,
                                        };
                                    }
                                )}
                                initialValidity={true}
                                onInput={inputHandler}
                            />

                            <FileUpload
                                id="testCases"
                                label="Test Cases of Challenge (Will replace the previous set)"
                                errorText="Please upload a file in valid JSON format"
                                onInput={inputHandler}
                            />

                            <Input
                                id="taskDescription"
                                type="text"
                                label="Brief Description of Task Requirement"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a description."
                                initialValue={challenge.taskDescription}
                                initialValidity={true}
                                onInput={inputHandler}
                            />

                            <Button type="submit" disabled={!formState.isValid}>
                                Submit
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
  }
};

export default EditStartupChallenge;
