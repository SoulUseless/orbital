import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import Button from '../../shared/components/formElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from '../../shared/hooks/form-hook';
import SubmitFile from '../../shared/components/formElements/SubmitFile';

const compareCredentials = (cred, req) => {
    const lang = cred.language._id === req.language._id;
    let tier;
    const cred_tier = cred.tier.name;
    const req_tier = req.tier.name;
    if (cred_tier === 'bronze') {
        tier = req_tier === 'bronze';
    }
    if (cred_tier === 'silver') {
        tier = !req_tier === 'gold';
    } else {
        tier = true;
    }
    return lang && tier;
};

const StartupChallenge = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [showModal, setShowModal] = useState(false);

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

  const openModalHandler = () => {
    setShowModal(true);
  }

  const closeModalHandler = () => {
    history.push(`/startup-challenge`);
    setShowModal(false);
  }

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/startup-challenge/${challengeId}`,
          "DELETE",
          {},
          { Authorization: `Bearer ${auth.token}` }
      );
      setResponse(responseData.message);
      openModalHandler();
  } catch (err) {
      console.log(err);
  }
  };

  const [challenge, setChallenge] = useState();
  const [student, setStudent] = useState();
  const [response, setResponse] = useState();

  useEffect(() => {
    const getChallenge = async () => {
      try {
          const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/startup-challenge/${challengeId}`);
          console.log(response);
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

  if (challenge) {
      let isQualified = false;
      let isOwner = false;
      if (auth.token) {
        if (auth.userType === "startup") {
          const ownerId = challenge.owner._id;
          isOwner = ownerId === auth.userId;
        } else if (auth.userType === "student" && student) {
            //const challengeReqIds = challenge.requirements.map(x => x._id);
            //const credentials = student.credentials.map(x => x._id);
            isQualified = challenge.requirements.every(x => {
                for (let j = 0; j < student.credentials.length; j++) {
                    if (compareCredentials(student.credentials[j], x)) {
                        return true;
                    }
                }
                return false;
            });
        }
      }
      //console.log(isQualified);
      const isCompleted =
        !auth.token || !student
            ? false
            : student.completedStartupChallenges.includes(challengeId);

      const challengeSubmitHandler = async (event) => {
        event.preventDefault();
        let responseData;
        const formData = new FormData(); //default browser js
        formData.append("submission", formState.inputs.file.value);
        //console.log(formData);
        try {
            responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/startup-challenge/submissions/${challengeId}`,
                "POST",
                formData,
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            if (responseData.message) {
                setResponse(responseData.message);
                openModalHandler();
            }
        } catch (err) {
            console.log(err);
        }
      };

      const footer =
          auth.token && auth.userType === "student" ? (
              isQualified ? (
                <>
                    <p> {isCompleted && "You have completed this before" } </p>
                    <form className='submit-form' onSubmit={challengeSubmitHandler}>
                    <div className='submit-file'>
                        <SubmitFile
                            center
                            id='file'
                            ext={challenge.requirements.map(x => x.language.fileExtension).reduce((x, y) => x + ", " + y)}
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
                  <h1> you are not qualified </h1>
              )
          ) : auth.token && auth.userType === "startup" ? (
              isOwner ? (
                  <span>
                    <Button onClick={showDeleteWarningHandler} danger>
                        <h2> Delete </h2>
                    </Button>

                    <Button to={`/startup-challenge/submissions/${challengeId}`}>
                        <h2> View Submissions </h2>
                    </Button>
                </span>
              ) : (
                  <></>
              )
          ) : (
              <div className="challenge-auth-container">
                  <Button to="/auth">
                      <h2> Log In/Sign Up as a Student to Submit </h2>
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
                      Do you want to proceed and delete this challenge? Please
                      note that it can't be undone thereafter.
                  </p>
              </Modal>

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
                              <img
                                  src={`${process.env.REACT_APP_ASSET_URL}/${challenge.owner.logo}`}
                                  alt={challenge.owner.name}
                              />
                              <h1> {challenge.name} </h1>
                              {auth.token &&
                                  auth.userType === "startup" &&
                                  isOwner && (
                                      <Link
                                          to={`/startup-challenge/edit/${challenge._id}`}
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
                                          {challenge.owner.name
                                              .charAt(0)
                                              .toUpperCase() +
                                              challenge.owner.name.slice(1)}
                                      </th>
                                  </tr>

                                  <tr>
                                      <th className="left-col">
                                          <h4>Pre-requisites</h4>
                                      </th>
                                      <td>
                                          <ul>
                                              {challenge.requirements.map(
                                                  (req, index) => (
                                                      <li
                                                          key={`requirement-${
                                                              index + 1
                                                          }`}
                                                      >
                                                          {`${
                                                              req.language.name
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                              req.language.name.slice(
                                                                  1
                                                              )
                                                          }: ${req.tier.name}`}
                                                      </li>
                                                  )
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
                                          <th className="test-case-col">
                                              Input
                                          </th>
                                          <th className="test-case-col">
                                              Expected Output
                                          </th>
                                      </tr>
                                      {challenge.testCases.publicTestCases.map(
                                          (ts, index) => {
                                              return (
                                                  <tr
                                                      key={`test-case-${
                                                          index + 1
                                                      }`}
                                                  >
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
      return <h1> No challenge with such id found. </h1>;
  }
};

export default StartupChallenge;
