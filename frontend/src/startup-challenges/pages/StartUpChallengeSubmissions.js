import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import Button from '../../shared/components/formElements/Button';
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from '../../shared/components/UIElements/Card';

import "./StartUpChallengeSubmissions.css";

const StartUpChallengeSubmissions = (props) => {
    const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
    const [submissions, setSubmissions] = useState();
    const cid = useParams().challengeId;
    const auth = useContext(AuthContext);
    useEffect(() => {//useEffect doesnt like a async function
          const getSubmissions = async () => {
          try {
            const response = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/startup-challenge/submissions/${cid}`,
                "GET",
                null,
                {
                    Authorization: `Bearer ${auth.token}`
                }
            );
            setSubmissions(response);
          } catch (err) {
            console.log(err);
          }
        }
        getSubmissions();
    }, [sendRequest, cid, auth.token]);

    const downloadHandler = (name) => async (event) => {
        //TODO: NOT DOWNLOADING, BUT SENDING TO CORRECT ENDPOINT
        try {
            const resp = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/${name}`
            );
            console.log("trig");
            console.log(resp);
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
            {!isLoading && submissions && (
                <Card className="submission__content">
                    <>
                        <div className="submission-header">
                            <h2> Submissions </h2>
                            <Button to={`/startup-challenge/${cid}`} inverse className="buttons">
                                    <h2> Back</h2>
                            </Button>
                        </div>
                        <div className="test-case-table-container">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>
                                            Student
                                        </th>
                                        <th>
                                            Successful?
                                        </th>
                                        <th>
                                            Download
                                        </th>
                                    </tr>
                                    {submissions.map(
                                        (sub, index) => {
                                            return (
                                                <tr
                                                    key={`submission-${
                                                        index + 1
                                                    }`}
                                                >
                                                    <td>{sub.owner.name}</td>
                                                    <td>
                                                        {sub.success.toString()}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            onClick={downloadHandler(sub.file)}
                                                        >
                                                            Download
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                </Card>
            )}
        </>
    );
};

export default StartUpChallengeSubmissions;