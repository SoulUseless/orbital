import React from 'react';

import HomeInfoList from './HomeInfoList.js';

const INFO_SHOWN = [
  {
    id: 'WHAT',
    text:
      'a platform which provides affirmation of your computing skills and possible opportunities in tech startups',
    url: 'https://image.flaticon.com/icons/svg/876/876225.svg',
  },
  {
    id: 'WHO',
    text: 'anyone who has a passion to further their skill set',
    url: 'https://image.flaticon.com/icons/svg/3068/3068421.svg',
  },
  {
    id: 'WHY',
    text: 'a chance to increase your basket of skill sets',
    url: 'https://image.flaticon.com/icons/svg/3135/3135816.svg',
  },
  {
    id: 'WHEN',
    text: 'anytime you like',
    url: 'https://image.flaticon.com/icons/svg/2693/2693560.svg',
  },
  {
    id: 'WHERE',
    text: 'anywhere which you feel comfortable coding',
    url: 'https://image.flaticon.com/icons/svg/2905/2905064.svg',
  },

  {
    id: 'HOW',
    text: 'sign up today to create an account and code away!',
    url: 'https://image.flaticon.com/icons/svg/1004/1004310.svg',
  },
];

const HomeInfo = (props) => {
  return <HomeInfoList items={INFO_SHOWN} />;
};

export default HomeInfo;
