import React from "react";

import Input from "../../shared/components/formElements/Input";
import Button from "../../shared/components/formElements/Button";
import Card from "../../shared/components/UIElements/Card";
//import MultiInput from "../../shared/components/formElements/MultiInput";
import MultiDropdown from "../../shared/components/formElements/MultiDropdown";
import FileUpload from "../../shared/components/formElements/FileUpload";

import {
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/form-hook";

import "./NewStartupChallenge.css";

const NewStartupChallenge = (props) => {
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

    const submitNewChallengeHandler = (event) => {
        console.log(event); //TO DO when backend up
    }

    console.log(formState.inputs);
    
    return (
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
                            ["java", "javascript", "python"],
                            ["silver", "gold"],
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
    );
};

export default NewStartupChallenge;