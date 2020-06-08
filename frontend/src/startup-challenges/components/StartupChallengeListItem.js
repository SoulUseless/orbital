import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import './StartupChallengeListItem.css';

const StartupChallengeListItem = props => {
    return (
      <li className="challenge-item">
        <Card className="challenge-item__content">
          <div className="challenge-item__image">
            <img src={props.url} alt={props.name} />
          </div>
          <div className="challenge-item__info">
            <h4>{props.name}</h4>
            <h5>{props.owner}</h5> {/*figure out how to format this nicely */}
          </div>
        </Card>
      </li>
    );
  };

export default StartupChallengeListItem;