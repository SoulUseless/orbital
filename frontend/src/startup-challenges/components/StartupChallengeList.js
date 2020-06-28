import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import StartupChallengeListItem from './StartupChallengeListItem';
import { AuthContext } from "../../shared/context/auth-context";

import './StartupChallengeList.css';


const StartupChallengeList = (props) => {
  const auth = useContext(AuthContext);

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
    //console.log( props.filters.filteredLanguage);
    if (!!props.filters.filteredLanguage) {
      challenges = challenges.filter((challenge) => {
        const reqs = challenge.requirements.map((ch) => ch.language.name);
        console.log(reqs);

        if (reqs.length === 0) {
          return true;
        }
        return reqs.reduce(
          (x, y) => x || props.filters.filteredLanguage.includes(y),
          false
        );
        /*props.filters.filteredLanguage.includes(challenge.language)*/
      });
    }
    if (!!props.filters.filteredTier) {
      challenges = challenges.filter((challenge) => {
        const tiers = challenge.requirements.map((req) => req.tier.name);
        if (tiers.length === 0) {
          return true;
        }
        return tiers.reduce(
          (x, y) => x || props.filters.filteredTier.includes(y),
          false
        );
        //props.filters.filteredTier.includes(challenge.tier)
      });
    }
    if (!!props.filters.filteredStartup) {
      console.log( props.filters.filteredStartup);
      challenges = challenges.filter((challenge) =>
        props.filters.filteredStartup.includes(challenge.owner.id)
      );
    }
    //console.log(props.filters.filteredRequirements);
    if (props.filters.filteredOwnership.length === 1) {
      const ownId = auth.userId;
      if (props.filters.filteredOwnership[0] === 'yes') {
        //view own challenges
        challenges = challenges.filter(
          (challenge) => challenge.owner.id === ownId
        );
      } else {
        challenges = challenges.filter(
          (challenge) => challenge.owner.id !== ownId
        );
      }
    }
    
    if (props.filters.filteredOwnership.length === 0) {
      challenges = [];
    }
  }

  if (challenges.length === 0) {
    return (
      <h4 className='center'>
        <Card>Search is too narrow, try widening your parameters.</Card>
      </h4>
    );
  }
  return (
    <ul className='challenge-list'>
      {challenges.map((challenge) => (
        <NavLink
          key={`challenge-${challenge.id}`}
          to={'/startup-challenge/' + challenge.id}
        >
          <StartupChallengeListItem
            name={challenge.name}
            owner={challenge.owner}
            requirements={challenge.requirements}
          />
        </NavLink>
      ))}
    </ul>
  );
};

export default StartupChallengeList;
