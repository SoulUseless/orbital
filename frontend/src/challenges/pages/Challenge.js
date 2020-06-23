import React, { useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/formElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import SubmitFile from '../../shared/components/formElements/SubmitFile';

import './Challenge.css';
import { useParams } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';

const DUMMY_CHALLENGE = [
  {
    id: 'c1',
    name: 'Factorial',
    description: 'my first challenge',
    language: 'javascript',
    requirements: ['c3', 'c5'], //to be populated to show more information
    requiredFor: ['c2', 'c4'],
    taskDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tier: 'bronze',
    url: 'https://cdn.worldvectorlogo.com/logos/javascript.svg',
    testCases: {
      publicTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
      privateTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
    },
  },
  {
    id: 'c2',
    name: 'Factorial',
    description: 'my first challenge',
    language: 'python',
    requirements: ['c3', 'c5'], //to be populated to show more information
    requiredFor: ['c2', 'c4'],
    taskDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tier: 'bronze',
    testCases: {
      publicTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
      privateTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
    },
    url: 'https://pluspng.com/img-png/python-logo-png-python-logo-450.png',
  },
  {
    id: 'c3',
    name: 'Factorial',
    description: 'my first challenge',
    language: 'javascript',
    requirements: ['c3', 'c5'], //to be populated to show more information
    requiredFor: ['c2', 'c4'],
    taskDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tier: 'silver',
    url: 'https://cdn.worldvectorlogo.com/logos/javascript.svg',
    testCases: {
      publicTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
      privateTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
    },
  },
  {
    id: 'c4',
    name: 'Factorial',
    description: 'my first challenge',
    language: 'python',
    requirements: [], //to be populated to show more information
    requiredFor: [],
    taskDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tier: 'silver',
    url: 'https://pluspng.com/img-png/python-logo-png-python-logo-450.png',
    testCases: {
      publicTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
      privateTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
    },
  },
  {
    id: 'c5',
    name: 'Factorial',
    description: 'my first challenge',
    language: 'python',
    requirements: ['c3', 'c5'], //to be populated to show more information
    requiredFor: ['c2', 'c4'],
    taskDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tier: 'gold',
    testCases: {
      publicTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
      privateTestCases: [
        { input: 'factorial(3)', output: '6' },
        { input: 'factorial(5)', output: '120' },
      ],
    },
    url: 'https://pluspng.com/img-png/python-logo-png-python-logo-450.png',
  },
];

const DUMMY_MODULES_COMPLETED = ['c3', 'c5'];

const Challenge = (props) => {
  const auth = useContext(AuthContext);

  const [inputHandler] = useForm(
    {
      file: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const challengeId = useParams().challengeId;
  //TO DO: replace with query, and replace if else with try catch
  const challenge = DUMMY_CHALLENGE.find((ch) => ch.id === challengeId);

  if (challenge) {
    const isQualified = challenge.requirements.reduce(
      (x, y) => x && DUMMY_MODULES_COMPLETED.includes(y),
      true
    );

    const footer =
      auth.isLoggedIn && auth.userType === 'student' ? (
        isQualified ? (
          <div className='upload-file'>
            <SubmitFile
              center
              id='file'
              onInput={inputHandler}
              errorText='Click below to upload file.'
            />
          </div>
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
    );
  } else {
    return <h1> No challenge with id found. </h1>;
  }
};

export default Challenge;
