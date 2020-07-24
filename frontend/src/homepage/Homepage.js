import React from 'react';

import Card from '../shared/components/UIElements/Card';
import './Homepage.css';

const Homepage = (info) => {
  return (
    <li className='info-item'>
      <Card className={`info-item__card ${info.id}`}>
        <div className='info-item__icon'>
          <img src={info.url} alt={info.id} />
        </div>
        <div className='info-item__description'>
          <h2>{info.id}</h2>
          <h3>{info.text}</h3>
        </div>
      </Card>
    </li>
  );
};

export default Homepage;
