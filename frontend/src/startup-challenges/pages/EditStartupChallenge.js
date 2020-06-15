import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import Input from "../../shared/components/formElements/Input";
import Button from "../../shared/components/formElements/Button";
import Card from "../../shared/components/UIElements/Card";
//import MultiInput from "../../shared/components/formElements/MultiInput";
import MultiDropdown from "../../shared/components/formElements/MultiDropdown";
//import FileUploader from "../../shared/components/formElements/FileUploader"; TODO
import {
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/form-hook";

const DUMMY_CHALLENGE = [
    {
        id: "c1",
        name: "Factorial",
        owner: "google", //startup profile name
        description: "my first challenge",
        requirements: [
            { tier: "javascript", level: "silver" },
            { tier: "java", level: "gold" },
        ], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        url: "https://cdn.worldvectorlogo.com/logos/google-icon.svg", //startup profile pic
        publicTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
        privateTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
    },
    {
        id: "c2",
        name: "Factorial",
        owner: "google", //startup profile name
        description: "my first challenge",
        requirements: [
            { tier: "java", level: "gold" },
            { tier: "python", level: "gold" },
        ], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        url: "https://cdn.worldvectorlogo.com/logos/google-icon.svg", //startup profile pic
        publicTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
        privateTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
    },
    {
        id: "c3",
        name: "Factorial",
        owner: "facebook", //startup profile name
        description: "my first challenge",
        requirements: [{ tier: "python", level: "gold" }], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        publicTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
        privateTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
        url:
            "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-2019-square1-512.png",
    },
    {
        id: "c4",
        name: "Factorial",
        owner: "tencent", //startup profile name
        description: "my first challenge",
        requirements: [{ tier: "python", level: "silver" }], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        publicTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
        privateTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
        url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv_MNlp6gBL_CAc8mnwUirBnqJIBN7yjtxZZhjxAMwExKm0beX&s",
    },
    {
        id: "c5",
        name: "Factorial",
        owner: "facebook", //startup profile name
        description: "my first challenge",
        requirements: [{ tier: "java", level: "silver" }], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        publicTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
        privateTestCases: [
            { input: "factorial(3)", output: "6" },
            { input: "factorial(5)", output: "120" },
        ],
        url:
            "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-2019-square1-512.png",
    },
];

const EditStartupChallenge = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const challengeId = useParams().challengeId;
    const challenge = DUMMY_CHALLENGE.find(ch => ch.id === challengeId);

    const [formState, inputHandler, setFormData] = useForm(
        {
          name: {
            value: '',
            isValid: false
          },
          description: {
            value: '',
            isValid: false
          },
          requirements: {
              value: [],
              isValid: true
          },
          taskDescription: {
              value: "",
              isValid: false
          },
          publicTestCases: { //probably do something like processing a uploaded json file
              value: {},
              isValid: true //temp for testing
          },
          privateTestCases: {
              value: {},
              isValid: true
          }
        },
        false
    );

    useEffect(() => {
        if (challenge) {
            setFormData(
                {
                    name: {
                        value: challenge.name,
                        isValid: true
                    },
                    description: {
                        value: challenge.description,
                        isValid: true
                    },
                    requirements: {
                        value: challenge.requirements,
                        isValid: true
                    },
                    taskDescription: {
                        value: challenge.taskDescription,
                        isValid: true
                    },
                    publicTestCases: { //probably do something like processing a uploaded json file
                        value: challenge.publicTestCases,
                        isValid: true //temp for testing
                    },
                    privateTestCases: {
                        value: challenge.privateTestCases,
                        isValid: true
                    }
                },
                true
            );
        }
        setIsLoading(false);
    }, [setFormData, challenge]);

    const submitUpdateChallengeHandler = (event) => {
        event.preventDefault();
        console.log(event); //TO DO when backend up
    }

    //console.log("input");
    console.log(formState.inputs);
    
    if (!challenge) {
        return <h1> No challenge with id found. </h1>
    }

    if (isLoading) {
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
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
                        initialValue={formState.inputs.name.value}
                        initialValidity={formState.inputs.name.isValid}
                        onInput={inputHandler}
                    />

                    <Input
                        id="description"
                        type="text"
                        label="Brief Description of Challenge"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a description."
                        initialValue={formState.inputs.description.value}
                        initialValidity={formState.inputs.description.isValid}
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
                        initialValidity={formState.inputs.requirements.isValid}
                        initialValue={formState.inputs.requirements.value}
                        onInput={inputHandler}
                    />

                    <Input
                        id="taskDescription"
                        type="text"
                        label="Brief Description of Task Requirement"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a description."
                        initialValue={formState.inputs.taskDescription.value}
                        initialValidity={formState.inputs.taskDescription.isValid}
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

export default EditStartupChallenge;