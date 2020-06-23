import React, { useState, useContext } from 'react';

import ChallengeList from '../components/ChallengeList';
import { AuthContext } from '../../shared/context/auth-context';

import './Challenges.css';

const DUMMY_CHALLENGES = [
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
    url:
      'https://pluspng.com/img-png/logo-javascript-png-file-javascript-logo-png-1052.png',
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
    id: 'c3',
    name: 'Factorial',
    description: 'my first challenge',
    language: 'javascript',
    requirements: ['c3', 'c5'], //to be populated to show more information
    requiredFor: ['c2', 'c4'],
    taskDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tier: 'silver',
    url:
      'https://pluspng.com/img-png/logo-javascript-png-file-javascript-logo-png-1052.png',
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
    name: 'Python',
    description: 'my first challenge',
    language: 'javascript',
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
];

const Challenges = (props) => {
  const [filteredLanguage, setFilteredLanguage] = useState([
    'python',
    'javascript',
  ]);
  const [filteredTier, setFilteredTier] = useState([
    'bronze',
    'silver',
    'gold',
  ]);
  const [filteredRequirements, setFilteredRequirements] = useState([
    'yes',
    'no',
  ]); //TO DO after profile is implemented
  const [hasFilters, setHasFilters] = useState(false);

  const auth = useContext(AuthContext);

  const languageFilterHandler = (event) => {
    const targetLanguage = event.target.value;
    let newFilteredLanguages;
    if (event.target.checked) {
      //something checked
      newFilteredLanguages = [...filteredLanguage];
      newFilteredLanguages.push(targetLanguage);
    } else {
      //something unchecked
      newFilteredLanguages = [...filteredLanguage].filter(
        (language) => language !== targetLanguage
      );
    }
    setFilteredLanguage(newFilteredLanguages);
    setHasFilters(true);
  };

  const tierFilterHandler = (event) => {
    const targetTier = event.target.value;
    let newFilteredTier;
    if (event.target.checked) {
      //something checked
      newFilteredTier = [...filteredTier];
      newFilteredTier.push(targetTier);
    } else {
      //something unchecked
      newFilteredTier = [...filteredTier].filter((tier) => tier !== targetTier);
    }
    setFilteredTier(newFilteredTier);
    setHasFilters(true);
    //console.log(filteredTier);
  };

  const requirementsFilterHandler = (event) => {
    const targetRequirements = event.target.value;
    console.log(targetRequirements);
    let newFilteredRequirements;
    if (event.target.checked) {
      //something checked
      newFilteredRequirements = [...filteredRequirements];
      newFilteredRequirements.push(targetRequirements);
    } else {
      //something unchecked
      newFilteredRequirements = [...filteredRequirements].filter(
        (requirement) => requirement !== targetRequirements
      );
    }
    setFilteredRequirements(newFilteredRequirements);
    console.log(filteredRequirements);
    setHasFilters(true);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 5fr',
        gridGap: 20,
      }}
    >
      <div className='sidebar'>
        {/*TO DO: SCALABLE, hide the sidebar when with is too small */}
        {/* radio buttons go here */}
        <h3> Filters </h3>
        <div onChange={languageFilterHandler}>
          <h4> Language</h4>
          <input type='checkbox' value='python' defaultChecked /> Python <br />
          <input type='checkbox' value='javascript' defaultChecked /> Javascript
        </div>

        <div onChange={tierFilterHandler}>
          <h4> Tier</h4>
          <input type='checkbox' value='bronze' defaultChecked /> Bronze <br />
          <input type='checkbox' value='silver' defaultChecked /> Silver <br />
          <input type='checkbox' value='gold' defaultChecked /> Gold
        </div>

        {auth.isLoggedIn && (
          <div onChange={requirementsFilterHandler}>
            <h4> Requirements </h4>
            <input type='checkbox' value='yes' defaultChecked /> Yes <br />
            <input type='checkbox' value='no' defaultChecked /> No
          </div>
        )}
      </div>
      <div>
        <ChallengeList
          items={DUMMY_CHALLENGES}
          hasFilters={hasFilters}
          filters={{
            filteredLanguage,
            filteredTier,
            filteredRequirements,
          }}
        />
      </div>
    </div>
  );
};

export default Challenges;
