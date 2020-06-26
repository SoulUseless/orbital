import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../../shared/components/formElements/Input';
import Button from '../../../shared/components/formElements/Button';
import Card from '../../../shared/components/UIElements/Card';
import ImageUpload from '../../../shared/components/formElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from '../../../shared/util/validators';
import { useForm } from '../../../shared/hooks/form-hook';
import './StartupProfile.css';

const DUMMY_STARTUPS = [
  {
    id: 's1',
    name: 'Google',
    logo:
      'data:image/png;base64,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', //should be url
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    challenges: ['c1', 'c2'], //can set up hyperlinks to the challenge page
    email: 'test@test.com',
  },
  {
    id: 's2',
    name: 'Facebook',
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEU7V53///8yUZrf5O8jR5aDkr45VZwrTJhFYaTY3eo1U5tqfbNOZqb4+vzJ0ONkebCtuNSJmMFBXaDq7fS7w9t8jbuNnMKksM/l6fLb4OzS1+fGzeC9xdyzvNegrM2TocZbcatwg7Xw8/hUa6kfRZUGOpHhj9NWAAAEF0lEQVR4nO3d6XKbMBSGYSGIJOQYMLbxltRL0vu/xXqJm3baYAER50jzvX8yk5kQnjG7AIvko6IpaxFLdTkr7jBx+1GZTFpFPWPflrIyM9UfwrTU8ejuKV2md2FuJPXseEma/CZMIwUKYU16FZaxAs+fYnkRVpp6Pjymq7PQxLeR+UyZRGwz6rnwWlaIJt618JJsRGmpZ8JrthR1zKvheUWM51AUIYQQQgghhBBCCPnt80KZUpFdNFNWaq3l74ud6vyLy28uSSlt2F51ppjJbLUo8nT+0TpNN/m22L28rn7sZ8vJ4VnoQIc9ldbPs0U6TdqbTk/rraGe2R5JfVilD3CfyufQPkSlbePMC1CotFk9WjZDFipZd/QFJlT6ad3RF5ZQml1nX1BCfTz1AIYjVNm+jy8gYVb1AwYj1C89gaEI9WtfYCBCveoNDEOoZ/2BQQjtoetxTGhC2f1AJiyh7rufCEVoD4OAAQj1JnKhfBoGZC9Utsv5fIjCwR8hd6GS28iFcjIUyF044Ig7DKGq55EL5XIwkLlQL2IXqkHH3AEI1cBD0luchbLbme9pnW+Lf9pxHnvqsBrOF8u32t5HR/+KWtGWdD2t2CyvI8GMF8evcrvIPW20DBB3zr65ASeBDmSfhUcn4ZH1mtaa26a0CvjRQafrwNMQty/3nHYWr+Euo0JkLgOik5Cf/swczu9P1DM5qCx/LMxDXkhF5nBI8xK20OFC4ip64T7kDY2TcBa98AlC1kEIIf8ghJB/EELIPwgh5B+EEPIPQgj5F4dQtfTuJGybAodHu01L0uVqYusULtEa7fBbDx+1ob0oPoJwF72Q+BXIIwiJBzZGEB6jF77RviHYv3BK6htDOCceQfUvzInvJ/Iv3EUvpB7n9y+kHgX3L5wQv07ev5D6Nnbvwin1+aF34Zr6hiLvwm30wkX0wh/RC5fUl+K8C8m/XcW7kHp36F1If4+0b+GG/Gkh38KCelPqXUj/MIZv4T56Ifnu0LuQfHfoW8jgMW7Pwjm1z7swJ98d+hYSj6xdUmWaf93W4TVt65a/33B4oEb97wH6ez8dRrmX7y0TYABsz+1OBeq5HFIcd5u0BSGE/IMQQv5BCCH/IISQfxBCyD8IIeQfhBDyD0II+QchhPyDEEL+QQgh/yCEkH8QQsg/CCHkH4QQ8g9CCPkHIYT8gxBC/kEIIf8ghJB/EELIPwgh5B+EEPIPQgg7VNO8ImQsoaoF0at6xhLaUjQ0C/tYQtmILc0ro8cSZoVIaL7oYyShMokg+pKIkYS6OguTkmJNHEcoy+QiTA3B5nQUoTXpVZjkZvxPcQyhNHlyEyZpqcfe3PgXKl1e/4e4TawyWtoxlX6FykptqttUxH1yRVPW30l4kF9hXTbFfSq/AEUxTy1Jf882AAAAAElFTkSuQmCC', //should be url
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    challenges: ['c3', 'c5'], //can set up hyperlinks to the challenge page
    email: 'test2@test.com',
  },
  {
    id: 's3',
    name: 'Facebook',
    logo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv_MNlp6gBL_CAc8mnwUirBnqJIBN7yjtxZZhjxAMwExKm0beX&s', //should be url
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    challenges: ['c4'], //can set up hyperlinks to the challenge page
    email: 'test3@test.com',
  },
];

const EditStartupProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const startupId = useParams().startupId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      logo: {
        value: null,
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      description: {
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

  const identifiedStartup = DUMMY_STARTUPS.find((s) => s.id === startupId);

  useEffect(() => {
    if (identifiedStartup) {
      setFormData(
        {
          name: {
            value: identifiedStartup.name,
            isValid: true,
          },
          logo: {
            value: identifiedStartup.logo,
            isValid: true,
          },
          email: {
            value: identifiedStartup.email,
            isValid: true,
          },
          description: {
            value: identifiedStartup.description,
            isValid: true,
          },
          password: {
            value: "",
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedStartup]);

  const submitStartupUpdateHandler = (event) => {
    event.preventDefault();
    console.log(event); //TO DO when backend up
  };

  console.log(formState.inputs);

  if (!identifiedStartup) {
    return (
      <div className='center'>
        <Card>
          <h2>No startup with id found!</h2>
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
    <div className='profile-form-container'>
      <Card className='profile-form'>
        <h2> Edit Profile </h2>
        <hr />
        <form onSubmit={submitStartupUpdateHandler}>
          <Input
            id='name'
            type='text'
            element='input'
            label='Name of Startup'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a name.'
            initialValue={formState.inputs.name.value}
            initialValidity={formState.inputs.name.isValid}
            onInput={inputHandler}
          />
          <Input
            id='email'
            type='text'
            element='input'
            label='Email of Startup'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            initialValue={formState.inputs.email.value}
            initialValidity={formState.inputs.email.isValid}
            onInput={inputHandler}
          />
          <ImageUpload
            center
            id='image'
            label='Startup Logo'
            errorText='Please provide an image.'
            initialValue={formState.inputs.logo.value}
            initialValidity={formState.inputs.logo.isValid}
            onInput={inputHandler}
          />

          <Input
            id='description'
            type='text'
            element="textarea"
            label='Profile Description'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a description.'
            initialValue={formState.inputs.description.value}
            initialValidity={formState.inputs.description.isValid}
            onInput={inputHandler}
          />

          <Input
            id='password'
            type='text'
            element='input'
            label='Password'
            errorText='Please enter a description.'
            initialValue={formState.inputs.password.value}
            initialValidity={formState.inputs.password.isValid}
            onInput={inputHandler}
          />

          <Button type='submit' disabled={!formState.isValid}>
            Update Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default EditStartupProfile;
