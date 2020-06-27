import React, { useState, useContext, useEffect } from 'react';

import StartupChallengeList from '../components/StartupChallengeList.js';
import Button from '../../shared/components/formElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import './StartupChallenge.css';

const StartupChallenges = (props) => {
  
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [loadedChallenges, setLoadedChallenges] = useState();
  
  const [filteredLanguage, setFilteredLanguage] = useState();
  const [filteredTier, setFilteredTier] = useState();
  const [filteredStartup, setFilteredStartup] = useState();

  const [allLanguages, setLanguages] = useState();
  const [allTiers, setTiers] = useState();
  const [allStartups, setStartups] = useState();

  //const userId = useParams().userId;
  useEffect(() => {//useEffect doesnt like a async function
      const getChallenges = async () => {
          try {
              const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/startup-challenge/all`);
              console.log(response);
              setLoadedChallenges(response.startupChallenges)
          } catch (err) {
              console.log(err);
          }
      };
      getChallenges();

      const getLanguages = async () => {
        try {
            const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/language`);
            setFilteredLanguage(response.languages.map(lang => lang.name));
            setLanguages(response.languages.map(lang => lang.name));
        } catch (err) {
            console.log(err);
        }
      };
      getLanguages();

      const getTiers = async () => {
          try {
              const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/tier`);
              setFilteredTier(response.tiers.map(t => t.name));
              setTiers(response.tiers.map(t => t.name));
          } catch (err) {
              console.log(err);
          }
      };
      getTiers();

      const getStartups = async () => {
        try {
          const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/startup`);
          setFilteredStartup(response.startups.map(su => su.id));
          setStartups(response.startups);
        } catch (err) {
          console.log(err);
        }
      }
      getStartups();
  }, [sendRequest]);

  const [filteredOwnership, setFilteredOwnership] = useState(['yes', 'no']); //TO DO after profile is implemented

  //can consider retrieving this from a database?
  const [hasFilters, setHasFilters] = useState(false);

  const auth = useContext(AuthContext);

  const languageFilterHandler = (event) => {
    const targetLanguage = event.target.value;
    let newFilteredLanguages;
    if (event.target.checked) {
      //something checked
      newFilteredLanguages = [...filteredLanguage];
      newFilteredLanguages.push(targetLanguage);
    } else {
      //something unchecked
      newFilteredLanguages = [...filteredLanguage].filter(
        (language) => language !== targetLanguage
      );
    }
    setFilteredLanguage(newFilteredLanguages);
    setHasFilters(true);
    //console.log(filteredLanguage);
  };

  const tierFilterHandler = (event) => {
    const targetTier = event.target.value;
    let newFilteredTier;
    if (event.target.checked) {
      //something checked
      newFilteredTier = [...filteredTier];
      newFilteredTier.push(targetTier);
    } else {
      //something unchecked
      newFilteredTier = [...filteredTier].filter((tier) => tier !== targetTier);
    }
    setFilteredTier(newFilteredTier);
    setHasFilters(true);
    //console.log(filteredTier);
  };

  const ownershipFilterHandler = (event) => {
    const targetOwnership = event.target.value;
    console.log(targetOwnership);
    let newFilteredOwnership;
    if (event.target.checked) {
      //something checked
      newFilteredOwnership = [...filteredOwnership];
      newFilteredOwnership.push(targetOwnership);
    } else {
      //something unchecked
      newFilteredOwnership = [...filteredOwnership].filter(
        (ownership) => ownership !== targetOwnership
      );
    }
    setFilteredOwnership(newFilteredOwnership);
    console.log(filteredOwnership);
    setHasFilters(true);
  };

  const startupFilterHandler = (event) => {
    const targetStartup = event.target.value;
    console.log(targetStartup);
    let newFilteredStartup;
    if (event.target.checked) {
      //something checked
      newFilteredStartup = [...filteredStartup];
      newFilteredStartup.push(targetStartup);
    } else {
      //something unchecked
      newFilteredStartup = [...filteredStartup].filter(
        (startup) => startup !== targetStartup
      );
    }
    setFilteredStartup(newFilteredStartup);
    //console.log(filteredStartup);
    setHasFilters(true);
  };


  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
            {/*render a loading spinner*/}
          </div>
        )}
      {!isLoading && loadedChallenges && allLanguages && allTiers && allStartups && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 5fr',
            gridGap: 20,
          }}
        >
          <div className='sidebar'>
            {/*TO DO: SCALABLE, hide the sidebar when with is too small */}
            {/* radio buttons go here */}
            <h3> Filters </h3>
            <div onChange={languageFilterHandler}>
              <h4> Language</h4>
              {allLanguages.map(lang => 
                    <>
                      <input type='checkbox' value={lang} key={lang} defaultChecked />
                        {" " + lang}
                      <br />
                    </>
                )}
            </div>

            <div onChange={tierFilterHandler}>
              <h4> Tier</h4>
              {allTiers.map(tier => 
                    <>
                      <input type='checkbox' value={tier} key={tier} defaultChecked />
                        {" " + tier}
                      <br />
                    </>
                )}
            </div>

            <div onChange={startupFilterHandler}>
              <h4> Startup</h4>
              {allStartups.map(su => 
                    <>
                      <input type='checkbox' value={su.id} key={su.id} defaultChecked />
                        {" " + su.name}
                      <br />
                    </>
                )}
            </div>

            {/*verify token going forward */}
            {auth.token && auth.userType === 'startup' && (
              <div onChange={ownershipFilterHandler}>
                <h4> Ownership </h4>
                <input type='checkbox' value='yes' defaultChecked /> View Mine
                <br />
                <input type='checkbox' value='no' defaultChecked /> View Others
              </div>
            )}
          </div>
          <div>
            {auth.token && auth.userType === 'startup' && (
              <div className='new-challenge-container'>
                <Button to='/startup-challenge/new'>
                  <h2> Create New Challenge</h2>
                </Button>
              </div>
            )}
            <StartupChallengeList
              items={loadedChallenges}
              hasFilters={hasFilters}
              filters={{
                filteredLanguage,
                filteredTier,
                filteredOwnership,
                filteredStartup,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StartupChallenges;
