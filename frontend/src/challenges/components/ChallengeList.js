import React, { useState, useContext, useEffect } from "react";
import { NavLink } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import ChallengeListItem from './ChallengeListItem';
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {AuthContext} from "../../shared/context/auth-context";

import './ChallengeList.css';

const ChallengeList = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [studentCompletedChallenges, setStudentCompletedChallenges] = useState();

  useEffect(() => {
    const getStudent = async () => {
      const studentId = auth.userId;
      try {
          const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/student/${studentId}`);
          setStudentCompletedChallenges(response.student.completedChallenges);
          //console.log(response.student.completedChallenges);
      } catch (err) {
          console.log(err);
      }
    };

    if (auth.token && auth.userType === "student") {
      getStudent();
    }

  }, [sendRequest, auth.token, auth.userId, auth.userType]);

  if (props.items.length === 0) {
    return (
      <div className='challenge-list-center'>
        <Card>
          <h2>No Challenge here yet.</h2>
        </Card>
      </div>
    );
  }

  let challenges = props.items;
  if (props.hasFilters) {
    if (!!props.filters.filteredLanguage) {
      challenges = challenges.filter((challenge) =>
        props.filters.filteredLanguage.includes(challenge.language)
      );
    }
    if (!!props.filters.filteredTier) {
      challenges = challenges.filter((challenge) =>
        props.filters.filteredTier.includes(challenge.tier)
      );
    }
    //console.log(props.filters.filteredRequirements);
    if (props.filters.filteredRequirements.length === 1) {
      challenges = challenges.filter((challenge) => {
        let result = true;
        for (let i = 0; i < challenge.requirements.length; i++) {
          if (
            !studentCompletedChallenges.includes(challenge.requirements[i]._id)
          ) {
            result = false;
          }
        }
        return props.filters.filteredRequirements[0] === 'yes' ? result : !result;
      });
    }

    if (props.filters.filteredRequirements.length === 0) {
      challenges = [];
    }
  }

  //console.log(challenges);
  if (challenges.length === 0) {
    return (
      <h4 className='center'>
        <Card>Search is too narrow, try widening your parameters.</Card>
      </h4>
    );
  }
  
  return (
      <>
          <ErrorModal error={error} onClear={errorHandler} />

          {isLoading && (
              <div className="center">
                  <LoadingSpinner />
                  {/*render a loading spinner*/}
              </div>
          )}
          <ul className="challenge-list">
              {challenges.map((challenge) => (
                  <NavLink
                      key={`challenge-${challenge.id}`}
                      to={"/challenges/" + challenge.id}
                  >
                      <ChallengeListItem
                          id={challenge.id}
                          name={challenge.name}
                          url={challenge.url}
                          tier={challenge.tier}
                      />
                  </NavLink>
              ))}
          </ul>
      </>
  );
};

export default ChallengeList;
