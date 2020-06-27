import React, {useState, useEffect, useContext} from "react";
import {useHistory} from "react-router-dom";

import Input from "../../shared/components/formElements/Input";
import Button from "../../shared/components/formElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
//import MultiInput from "../../shared/components/formElements/MultiInput";
import MultiDropdown from "../../shared/components/formElements/MultiDropdown";
import FileUpload from "../../shared/components/formElements/FileUpload";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

import {
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/form-hook";

import "./NewStartupChallenge.css";

const NewStartupChallenge = (props) => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [response, setResponse] = useState();
    const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            name: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
            requirements: {
                value: [],
                isValid: true,
            },
            taskDescription: {
                value: "",
                isValid: false,
            },
            testCases: {
                value: { privateTestCases: [], publicTestCases: [] },
                isValid: false,
            },
        },
        false
    );

    const openModalHandler = () => {
        setShowModal(true);
    }
    
    const closeModalHandler = () => {
        setShowModal(false);
        history.push(`/startup-challenge/${response.challenge._id}`);
    }

  const [allLanguages, setLanguages] = useState();
  const [allTiers, setTiers] = useState();

  useEffect(() => {
      const getLanguages = async () => {
        try {
            const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/language`);
            setLanguages(response.languages.map(lang => lang.name));
        } catch (err) {
            console.log(err);
        }
      };
      getLanguages();

      const getTiers = async () => {
          try {
              const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/tier`);
              setTiers(response.tiers.map(t => t.name));
          } catch (err) {
              console.log(err);
          }
      };
          getTiers();
      }, [sendRequest]);

    console.log(formState.inputs);

    const submitNewChallengeHandler = async (event) => {
        event.preventDefault();
        console.log(formState.inputs); //TO DO when backend up
        let responseData;
        try {
            //this one to catch whether the log in is successful
            responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + "/startup-challenge/new",
                "POST",
                JSON.stringify({
                    name: formState.inputs.name.value,
                    description: formState.inputs.description.value,
                    requirements: formState.inputs.requirements.value,
                    taskDescription: formState.inputs.taskDescription.value,
                    testCases: formState.inputs.testCases.value,
                }),
                {
                    "Content-Type": "application/json", //configure type of request to json
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setResponse(responseData);
            openModalHandler();
      
        } catch (err) {
            console.log(err);
        }

    };

    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                    {/*render a loading spinner*/}
                </div> 
            )}

            <Modal
                show={showModal}
                onCancel={closeModalHandler}
                header="Result of Submission"
                contentClass="modal-content"
                footerClass="modal-actions"
                footer={<Button onClick={closeModalHandler}>CLOSE</Button>}
            >
                <div className="modal-container">
                    {response && response.message}
                </div>
            </Modal>

            {allTiers && allLanguages && (
                <div className="challenge-form-container">
                    <Card className="challenge-form">
                        <h2> New Challenge Creator </h2>
                        <hr />
                        <form onSubmit={submitNewChallengeHandler}>
                            <Input
                                element="input"
                                id="name"
                                type="text"
                                label="Name of Challenge"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a name."
                                onInput={inputHandler}
                            />

                            <Input
                                id="description"
                                type="text"
                                label="Brief Description of Challenge"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a description."
                                onInput={inputHandler}
                            />

                            <MultiDropdown
                                element="input"
                                id="requirements"
                                options={[
                                    allLanguages,
                                    allTiers,
                                ]}
                                label="Requirements of Challenge"
                                errorText="Please enter at least one requirement."
                                onInput={inputHandler}
                            />

                            {/*changed to process json in frontend*/}
                            <FileUpload
                                id="testCases"
                                label="Test Cases of Challenge"
                                errorText="Please upload a file in valid JSON format"
                                onInput={inputHandler}
                            />

                            <Input
                                id="taskDescription"
                                type="text"
                                label="Brief Description of Task Requirement"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a description."
                                onInput={inputHandler}
                            />

                            {/* hold up for test case setting*/}

                            <Button type="submit" disabled={!formState.isValid}>
                                Submit
                            </Button>
                        </form>
                    </Card>
                </div> 
            )}
        </>
    );
};

export default NewStartupChallenge;