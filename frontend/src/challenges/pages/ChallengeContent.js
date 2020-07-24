import React, { useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/formElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import SubmitFile from '../../shared/components/formElements/SubmitFile';

import './ChallengeContent';
import { useForm } from '../../shared/hooks/form-hook';

//const DUMMY_MODULES_COMPLETED = ['c3', 'c5'];

const ChallengeContent = (props) => {
  const auth = useContext(AuthContext);
  const challenge = props.item;
  console.log(challenge);
  const [formState, inputHandler] = useForm(
    {
      file: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const challengeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  if (!challenge) {
    return <h1> No challenge with id found. </h1>;
  } else {
    const isQualified = true;
    const footer =
      auth.token && auth.userType === 'student' ? (
        isQualified ? (
          <form className='submit-form' onSubmit={challengeSubmitHandler}>
            <div className='submit-file'>
              <SubmitFile
                center
                id='file'
                onInput={inputHandler}
                errorText='Click below to upload file.'
              />
              <Button type='submit' disabled={!formState.isValid}>
                SUBMIT
              </Button>
            </div>
          </form>
        ) : (
          /*<div className='upload-file'>
                <h1> File Upload </h1>
                <Button to='/FileUpload'>Upload</Button>
            </div>*/
          <h1> you are not qualified </h1>
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
        <div className='challenge-container'>
          <Card className='challenge'>
            <div className='challenge-header'>
              <img src={challenge.url} alt={'javascript'} />
              <h1> {challenge.name} </h1>
              <Button to='/challenges' inverse>
                <h2> Back</h2>
              </Button>
            </div>
            <hr />

            <table>
              <tbody>
                <tr>
                  <th className='left-col'>
                    <h4>Description</h4>
                  </th>
                  <th>{challenge.description}</th>
                </tr>

                <tr>
                  <th className='left-col'>
                    <h4>Pre-requisites</h4>
                  </th>
                  <td>
                    <ul>
                      {challenge.requirements.map((req) => {
                        return <li> {req} </li>;
                      })}
                    </ul>
                  </td>
                </tr>

                <tr>
                  <th className='left-col'>
                    <h4>Required For</h4>
                  </th>
                  <td>
                    <ul>
                      {challenge.requiredFor.map((req) => {
                        return <li> {req} </li>;
                      })}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>

            <hr />

            <h2> Task Requirements </h2>
            <p>{challenge.taskDescription}</p>

            <h2> Public Test Cases </h2>
            <div className='test-case-table-container'>
              <table className='test-case-table'>
                <tbody>
                  <tr>
                    <th className='test-case-col'>Input</th>
                    <th className='test-case-col'>Expected Output</th>
                  </tr>
                  {challenge.testCases.publicTestCases.map((ts) => {
                    return (
                      <tr>
                        <td className='test-case-col'>{ts.input}</td>
                        <td className='test-case-col'>{ts.output}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {footer}
          </Card>
        </div>
      </>
    );
  }
};

export default ChallengeContent;
