import React from 'react';

import StartupItem from './StartupItem';
import Card from '../../../shared/components/UIElements/Card';
import './StartupList.css';

const StartupList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No startup found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className='startup-list'>
      {props.items.map((startup) => (
        <StartupItem
          key={startup.id}
          id={startup.id}
          logo={startup.logo}
          name={startup.name}
          email={startup.email}
          password={startup.password}
          description={startup.description}
          challenges={startup.challenges}
        />
      ))}
    </ul>
  );
};

export default StartupList;
