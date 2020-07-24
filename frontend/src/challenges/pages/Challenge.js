import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/formElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import SubmitFile from '../../shared/components/formElements/SubmitFile';

import './Challenge.css';
import { useForm } from '../../shared/hooks/form-hook';
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Challenge = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [showModal, setShowModal] = useState(false);

  const openModalHandler = () => {
    setShowModal(true);
  }

  const closeModalHandler = () => {
    setShowModal(false);
  }

  const [formState, inputHandler] = useForm(
    {
      file: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const challengeId = useParams().challengeId;

  const [challenge, setChallenge] = useState();
  const [student, setStudent] = useState();
  const [response, setResponse] = useState();

  useEffect(() => {
    const getChallenge = async () => {
      try {
          const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/challenge/${challengeId}`);
          //console.log(response);
          setChallenge(response.challenge);
      } catch (err) {
          console.log(err);
      }
    };
    getChallenge();

    const getStudent = async () => {
      const studentId = auth.userId;
      try {
          const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/student/${studentId}`);
          setStudent(response.student);
      } catch (err) {
          console.log(err);
      }
    };

    if (auth.token && auth.userType === "student") {
      getStudent();
    }

  }, [sendRequest, challengeId, auth.token, auth.userId, auth.userType]);

  const challengeSubmitHandler = async (event) => {
    event.preventDefault();
    let responseData;
    const formData = new FormData(); //default browser js
    formData.append("submission", formState.inputs.file.value);
    //console.log(formData);
    try {
        responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/challenge/submissions/${challengeId}`,
            "POST",
            formData,
            {
                Authorization: `Bearer ${auth.token}`,
            }
        );
        console.log(responseData);
        if (responseData.message) {
            setResponse(responseData.message);
            openModalHandler();
        }
    } catch (err) {
        console.log(err);
    }
  };

  if (challenge) {
    console.log(challenge);
    //console.log(student);
    const isQualified =
        !auth.token || !student
            ? false
            : challenge.requirements.reduce(
                  (x, y) => x && student.completedChallenges.includes(y._id),
                  true
              );
    
    const isCompleted =
        !auth.token || !student
            ? false
            : student.completedChallenges.includes(challengeId);

    const footer =
      auth.token ? (
        auth.userType === 'student' ? (
            isQualified ? (
                <>
                    <p> {isCompleted && "You have completed this before" } </p>
                    <form className='submit-form' onSubmit={challengeSubmitHandler}>
                    <div className='submit-file'>
                        <SubmitFile
                        center
                        id='file'
                        ext={challenge.languageExtension}
                        onInput={inputHandler}
                        errorText='Click below to upload file.'
                        />
                        <Button type='submit' disabled={!formState.isValid}>
                        SUBMIT
                        </Button>
                    </div>
                    </form>
                </>
            ) : (
            <h1> You are not qualified. </h1>
            )
        ) : (
            <></>
        )
      ) : (
        <div className='challenge-auth-container'>
          <Button to='/auth'>
            <h2> Log In/Sign Up as a Student to continue</h2>
          </Button>
        </div>
      );

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
                contentClass="challenge__modal-content"
                footerClass="challenge__modal-actions"
                footer={<Button onClick={closeModalHandler}>CLOSE</Button>}
            >
                <div className="modal-container">
                    {response &&
                        response.split("\n").map((line) => <p>{line}</p>)}
                </div>
            </Modal>

            {!isLoading && challenge && (
                <div className="challenge-container">
                    <Card className="challenge">
                        <div className="challenge-header">
                            <img src={challenge.url} alt={"javascript"} />
                            <h1> {challenge.name} </h1>
                            <Button to="/challenges" inverse>
                                <h2> Back</h2>
                            </Button>
                        </div>
                        <hr />

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
                                        <h4>Pre-requisites</h4>
                                    </th>
                                    <td>
                                        <ul>
                                            {challenge.requirements.map(
                                                (req, index) => {
                                                    return (
                                                        <li key={`req${index}`}>
                                                            <Link
                                                                to={`/challenges/${req._id}`}
                                                            >
                                                                {req.name}
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </td>
                                </tr>

                                <tr>
                                    <th className="left-col">
                                        <h4>Required For</h4>
                                    </th>
                                    <td>
                                        <ul>
                                            {challenge.requiredFor.map(
                                                (req, index) => {
                                                    return (
                                                        <li key={`req${index}`}>
                                                            <Link
                                                                to={`/challenges/${req._id}`}
                                                            >
                                                                {req.name}
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                            )}
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
                                    {challenge.testCases.publicTestCases.map(
                                        (ts, index) => {
                                            return (
                                                <tr key={`testcase${index}`}>
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
            )}
        </>
    );
  } else {
    return <h1> No challenge with id found. </h1>;
  }
};

export default Challenge;
