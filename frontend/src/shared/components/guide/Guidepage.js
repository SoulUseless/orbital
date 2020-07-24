import React from 'react';

import Card from '../UIElements/Card';
import './Guidepage.css';

const Guidepage = (info) => {
  return (
    <li className='guide-item'>
      <Card className={`guide-item__card ${info.id}`}>
        <div className='guide-item__icon'>
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

export default Guidepage;
