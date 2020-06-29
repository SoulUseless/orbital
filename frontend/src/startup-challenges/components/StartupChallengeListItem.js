import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import './StartupChallengeListItem.css';

const StartupChallengeListItem = (props) => {
  const arrayOfRequirements = props.requirements;
  //console.log(props.requirements);
  const languages = arrayOfRequirements.map((obj) => obj.language.name).reduce((x, y) => x + ", " + y);
  //console.log(languages);

  return (
    <li className='challenge-item'>
      <Card className='challenge-item__card'>
        <div className='challenge-item__image'>
          <img src={`${process.env.REACT_APP_ASSET_URL}/${props.owner.logo}`} alt={props.name} />
        </div>
        <div className='startup-challenge-item__info'>
          <h4>{props.name}</h4>
          <h5>{languages}</h5>
          <h5>{props.owner.name}</h5> {/*figure out how to format this nicely */}
        </div>
      </Card>
    </li>
  );
};

export default StartupChallengeListItem;
