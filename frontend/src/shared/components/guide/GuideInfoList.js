import React from 'react';

import Guide from './Guidepage.js';
import './GuideInfoList.css';

const GuideInfoList = (props) => {
  return (
    <ul className='info-list'>
      {props.items.map((info) => (
        <Guide id={info.id} text={info.text} url={info.url} />
      ))}
    </ul>
  );
};

export default GuideInfoList;
