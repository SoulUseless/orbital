import React from 'react';

import Homepage from './Homepage.js';
import './HomeInfoList.css';

const HomeInfoList = (props) => {
  return (
    <ul className='info-list'>
      {props.items.map((info) => (
        <Homepage id={info.id} text={info.text} url={info.url} />
      ))}
    </ul>
  );
};

export default HomeInfoList;
