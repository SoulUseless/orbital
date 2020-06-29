import React, { useState, useEffect } from "react";

import StartupList from '../../components/startups/StartupList';
import { useHttpClient } from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

const Startups = (props) => {
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [startups, setStartups] = useState();

  useEffect(() => {//useEffect doesnt like a async function
    const getStartups = async () => {
        try {
            const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/startup`);
            setStartups(response.startups);
        } catch (err) {
            console.log(err);
        }
    };
    getStartups();
  }, [sendRequest]);

  return (
    <>
        <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && (
            <div className="center">
                <LoadingSpinner />
                {/*render a loading spinner*/}
            </div>
        )}
        {!isLoading && startups && <StartupList items={startups} />}
    </>
  );
};

export default Startups;
