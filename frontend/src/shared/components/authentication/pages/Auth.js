import React, { useState, useContext } from 'react';

import Card from '../../UIElements/Card';
import Input from '../../formElements/Input';
import Button from '../../formElements/Button';
import ImageUpload from '../../formElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../../util/validators';
import { useForm } from '../../../hooks/form-hook';
import { AuthContext } from '../../../context/auth-context';
import './Auth.css';

const Auth = (props) => {
  //return <h1> Auth </h1>;
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userType, setUserType] = useState('Student');

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const switchUserType = () => {
    if (userType === 'Student') {
      setUserType('Startup');
    } else {
      setUserType('Student');
    }
  };

  const authSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (userType === 'Student') {
      auth.loginAsStudent(); //TO DO when backend is up
    } else {
      auth.loginAsStartup(); //TO DO when backend is up
    }
  };

  return (
    <Card className='authentication'>
      {isLoginMode && <h2>Login as {userType}</h2>}
      {!isLoginMode && <h2> Signup as {userType} </h2>}
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element='input'
            id='name'
            type='text'
            label='Your Name'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a name.'
            onInput={inputHandler}
          />
        )}
        {!isLoginMode && (
          <ImageUpload
            center
            id='image'
            onInput={inputHandler}
            errorText='Please provide an image.'
          />
        )}
        <Input
          element='input'
          id='email'
          type='email'
          label='E-Mail'
          validators={[VALIDATOR_EMAIL()]}
          errorText='Please enter a valid email address.'
          onInput={inputHandler}
        />
        <Input
          element='input'
          id='password'
          type='password'
          label='Password'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid password, at least 5 characters.'
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>

      <Button inverse onClick={switchUserType}>
        {isLoginMode ? 'Login' : 'Signup'} As:{' '}
        {userType === 'Student' ? 'Startup' : 'Student'}
      </Button>

      <Button inverse onClick={switchModeHandler}>
        Click here to {isLoginMode ? 'Signup' : 'Login'}
      </Button>
    </Card>
  );
};

export default Auth;
