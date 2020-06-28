import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { AuthContext } from '../../../shared/context/auth-context';
import Button from '../../../shared/components/formElements/Button';
import Card from '../../../shared/components/UIElements/Card';
import Avatar from '../../../shared/components/UIElements/Avatar';
import { useHttpClient } from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner"

import './StartupProfile.css';

const StartupProfile = (props) => {
  const auth = useContext(AuthContext);
  const startupId = useParams().startupId;
  const [startup, setStartup] = useState();
  //todo: retrieve profile from backend

  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  useEffect(() => {
      //useEffect doesnt like a async function
      const getStartup = async () => {
          try {
              const response = await sendRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/startup/${startupId}`
              );
              setStartup(response.startup);
          } catch (err) {
              console.log(err);
          }
      };
      getStartup();
  }, [sendRequest, startupId]);

  console.log(startup);

  return (
      <>
          <ErrorModal error={error} onClear={errorHandler} />
          {isLoading && (
              <div className="center">
                  <LoadingSpinner />
                  {/*render a loading spinner*/}
              </div>
          )}

          {!isLoading && startup && (
              <Card className="startup-profile__content">
                  {/*figure how to shift card to center*/}
                  <div className="startup-profile__logo">
                      <Avatar center image={`${process.env.REACT_APP_ASSET_URL}/${startup.logo}`} alt={startup.name} />
                  </div>
                  <div className="startup-item__info">
                      <h1>{startup.name}</h1>
                      <h2>{startup.email}</h2>
                      <h3>{startup.description}</h3>
                  </div>

                  {auth.token &&
                      auth.userType === "startup" &&
                      auth.userId === startup._id && (
                          <Button
                              to={`/startup/edit/${startup._id}`}
                              className="startup-item__button"
                          >
                              EDIT
                          </Button>
                      )}
              </Card>
          )}
      </>
  );
}
export default StartupProfile;
