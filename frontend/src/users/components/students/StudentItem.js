import React from 'react';

import Avatar from '../../../shared/components/UIElements/Avatar';
import Card from '../../../shared/components/UIElements/Card';
import Button from '../../../shared/components/formElements/Button';

import './StudentItem.css';

const StudentItem = (props) => {
  const editProfileHandler = (event) => {
    event.preventDefault();
    console.log('editing'); // send this to the backend!
  };
  return (
    <form className='student-item' onClick={editProfileHandler}>
      <Card className='student-item__content'>
        <div className='student-item__image'>
          <Avatar center image={props.image} alt={props.name} />
        </div>

        <div className='student-item__info'>
          <h1>{props.name}</h1>
          <h2>{props.email}</h2>
        </div>
        <Button className='student-item__button' type='edit'>
          {/*figure how to align better*/}
          EDIT
        </Button>
      </Card>
    </form>
  );
};

export default StudentItem;
