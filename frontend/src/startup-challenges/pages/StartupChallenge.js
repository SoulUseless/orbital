import React, { useState, useContext } from "react";
import { Link, useParams } from 'react-router-dom';

import Button from "../../shared/components/formElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import {AuthContext} from "../../shared/context/auth-context";

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

const DUMMY_CREDENTIALS = {
    javascript: "gold",
    java: "gold"
};

const compareCredentials = (c1, c2) => {
    if (c1 === "bronze") {
        return c2 === "bronze";
    }
    if (c1 === "silver") {
        return ! c2 === "gold";
    } else {
        return true;
    }
};

const StartupChallenge = (props) => {
    const auth = useContext(AuthContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };
    
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };
    
    const confirmDeleteHandler = () => {
        setShowConfirmModal(false);
        console.log("DELETING..."); //TODO: send DELETE request
    };

    const challengeId = useParams().challengeId;
    //TO DO: replace with query, and replace if else with try catch
    const challenge = DUMMY_CHALLENGE.find(ch => ch.id === challengeId);

    if (challenge) {
        let isQualified;
        if (!auth.isLoggedIn || !auth.userType === "student") {
            isQualified = false;
        } else {
            console.log(Object.keys(DUMMY_CREDENTIALS));
            console.log(
                Object.keys(challenge.requirements).reduce(
                    (x, y) =>
                        x &&
                        Object.keys(DUMMY_CREDENTIALS).includes(y) &&
                        compareCredentials(
                            DUMMY_CREDENTIALS[y],
                            challenge.requirements[y]
                        ),
                    true
                )
            );

            isQualified = Object.keys(challenge.requirements).reduce(
                (x, y) =>
                    x &&
                    Object.keys(DUMMY_CREDENTIALS).includes(y) &&
                    compareCredentials(
                        DUMMY_CREDENTIALS[y],
                        challenge.requirements[y]
                    ),
                true
            );
        }
        console.log(isQualified);

        const footer =
            auth.isLoggedIn && auth.userType === "student" ? (
                isQualified ? (
                    <h1> SUBMITTER PLACEHOLDER </h1>
                ) : (
                    <h1> you are not qualified </h1>
                )
            ) : auth.isLoggedIn && auth.userType === "startup" ? (
                <Button onClick={showDeleteWarningHandler} danger>
                    {" "}
                    {/*check for startup credentials TODO */}
                    <h2> Delete </h2>
                </Button>
            ) : (
                <div className="challenge-auth-container">
                    <Button to="/auth">
                        <h2> Log In/Sign Up as a Student to Submit </h2>
                    </Button>
                </div>
            );

        return (
            <div className="challenge-container">
                <Card className="challenge">
                    <div className="challenge-header">
                        <img src={challenge.url} alt={"javascript"} />
                        <h1> {challenge.name} </h1>
                        {auth.isLoggedIn && auth.userType === "startup" && (
                            <Link
                                to={`/startup-challenge/edit/${challenge.id}`}
                            >
                                <img
                                    src="https://toppng.com/uploads/preview/free-download-pencil-chalk-png-clipart-clip-art-pencil-ico-11562901060ymmwp55mwl.png"
                                    alt="Edit"
                                    height="100%"
                                    width="auto"
                                    padding-left="20px"
                                />
                            </Link>
                        )}

                        <Button to="/startup-challenge" inverse>
                            <h2> Back</h2>
                        </Button>
                    </div>
                    <hr />

                    <Modal
                        show={showConfirmModal}
                        onCancel={cancelDeleteHandler}
                        header="Are you sure?"
                        footerClass="place-item__modal-actions"
                        footer={
                            <React.Fragment>
                                <Button inverse onClick={cancelDeleteHandler}>
                                    CANCEL
                                </Button>
                                <Button danger onClick={confirmDeleteHandler}>
                                    DELETE
                                </Button>
                            </React.Fragment>
                        }
                    >
                        <p>
                            Do you want to proceed and delete this challenge?
                            Please note that it can't be undone thereafter.
                        </p>
                    </Modal>

                    <table>
                        <tbody>
                            <tr>
                                <th className="left-col">
                                    <h4>Description</h4>
                                </th>
                                <th>{challenge.description}</th>
                            </tr>

                            <tr>
                                <th className="left-col">
                                    <h4>Startup</h4>
                                </th>
                                <th>
                                    {challenge.owner
                                        .charAt(0)
                                        .toUpperCase() +
                                        challenge.owner.slice(1)}
                                </th>
                            </tr>

                            <tr>
                                <th className="left-col">
                                    <h4>Pre-requisites</h4>
                                </th>
                                <td>
                                    <ul>
                                        {challenge.requirements.map((req, index) => (
                                            <li key={`requirement-${index + 1}`}>
                                                {`${
                                                    req.tier
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    req.tier.slice(1)
                                                }: ${
                                                    req.level
                                                }`}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <hr />

                    <h2> Task Requirements </h2>
                    <p>{challenge.taskDescription}</p>

                    <h2> Public Test Cases </h2>
                    <div className="test-case-table-container">
                        <table className="test-case-table">
                            <tbody>
                                <tr>
                                    <th className="test-case-col">Input</th>
                                    <th className="test-case-col">
                                        Expected Output
                                    </th>
                                </tr>
                                {challenge.publicTestCases.map(
                                    (ts, index) => {
                                        return (
                                            <tr key={`test-case-${index + 1}`}>
                                                <td className="test-case-col">
                                                    {ts.input}
                                                </td>
                                                <td className="test-case-col">
                                                    {ts.output}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>

                    {footer}
                </Card>
            </div>
        );
    } else {
        return <h1> No challenge with such id found. </h1>;
    }
}

export default StartupChallenge;