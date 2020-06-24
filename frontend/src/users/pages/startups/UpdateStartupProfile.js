import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/formElements/Input';
import Button from '../../shared/components/formElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ImageUpload from '../../shared/components/formElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './StartupProfileForm.css';

const DUMMY_STARTUP_PROFILE = [
  {
    id: 's1',
    name: 'startup',
    email: 'startup@123.com',
    profilePicture:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    password: '123456',
  },
];

const UpdateStartupProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const startupId = useParams().startupId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      profilePicture: {
        value: null,
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const identifiedStartup = DUMMY_STARTUP_PROFILE.find(
    (s) => s.id === startupId
  );

  useEffect(() => {
    if (identifiedStartup) {
      setFormData(
        {
          name: {
            value: identifiedStartup.name,
            isValid: true,
          },
          email: {
            value: identifiedStartup.email,
            isValid: true,
          },
          profilePicture: {
            value: identifiedStartup.profilePicture,
            isValid: true,
          },
          password: {
            value: identifiedStartup.password,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedStartup]);

  const startupProfileUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedStartup) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find startup!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='center'>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className='place-form' onSubmit={startupProfileUpdateSubmitHandler}>
      <Input
        id='name'
        element='input'
        type='text'
        label='Name'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid name.'
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id='email'
        element='email'
        type='email'
        label='E-Mail'
        validators={[VALIDATOR_EMAIL()]}
        errorText='Please enter a valid email address.'
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <ImageUpload
        center
        id='profilePicture'
        onInput={inputHandler}
        errorText='Please provide a picture of your startup logo.'
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
        UPDATE PROFILE
      </Button>
    </form>
  );
};

export default UpdateStartupProfile;
