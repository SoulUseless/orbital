import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import './ChallengeListItem.css';

const ChallengeListItem = props => {
    return (
      <li className="challenge-item">
        <Card className="challenge-item__content">
          <div className="challenge-item__image">
            <img src={props.url} alt={props.name} />
          </div>
          <div className="challenge-item__info">
            <h4>{props.name}</h4>
          </div>
        </Card>
      </li>
    );
  };

export default ChallengeListItem;