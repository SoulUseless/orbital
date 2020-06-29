import React from 'react';
import {Link} from "react-router-dom";

import Avatar from '../../../shared/components/UIElements/Avatar';
import Card from '../../../shared/components/UIElements/Card';
//import Button from '../../../shared/components/formElements/Button';

import './StartupItem.css';

const StartupItem = (props) => {
  //console.log(`${process.env.REACT_APP_ASSET_URL}/${props.logo}`);
  return (
    <Link to={`/startup/${props.id}`}>
    {/*<form className='startup-item' onClick={editProfileHandler}>
        AND YOU DONT NEED A FORM FOR REDIRECTION WTF */}
      <Card className='startup-item__content'>
        <div className='startup-item__image'>
          <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.logo}`} alt={props.name} />
        </div>

        <div className='startup-item__info'>
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
    {/*</form>*/}
    </Link>
  );
};

export default StartupItem;
