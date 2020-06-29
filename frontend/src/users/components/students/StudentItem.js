import React from 'react';
import {Link} from "react-router-dom";

import Avatar from '../../../shared/components/UIElements/Avatar';
import Card from '../../../shared/components/UIElements/Card';
//import Button from '../../../shared/components/formElements/Button';

import './StudentItem.css';

const StudentItem = (props) => {
  console.log(props.image);
  return (
    <Link to={`/student/${props.id}`}>
      {/*<form className='student-item' onClick={editProfileHandler}>
        AND YOU DONT NEED A FORM FOR REDIRECTION WTF */}
        <Card className='student-item__content'>
          <div className='student-item__image'>
            <Avatar center image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
          </div>

          <div className='student-item__info'>
            <h1>{props.name}</h1>
            <h2>{props.email}</h2>
          </div>

          {/* TF do you have a edit button on the list
            <Button className='student-item__button' type='edit'>
              figure how to align better
              EDIT
            </Button>
          */}
        </Card>
      {/* </form> */}
    </Link>
  );
};

export default StudentItem;
