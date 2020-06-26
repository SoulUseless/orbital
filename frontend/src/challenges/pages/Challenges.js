import React, { useEffect, useState, useContext } from 'react';
//import { useParams } from "react-router-dom";

import ChallengeList from '../components/ChallengeList';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import './Challenges.css';
const Challenges = (props) => {

  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [loadedChallenges, setLoadedChallenges] = useState();
  
  const [filteredLanguage, setFilteredLanguage] = useState();
  const [filteredTier, setFilteredTier] = useState();

  const [allLanguages, setLanguages] = useState();
  const [allTiers, setTiers] = useState();

  //const userId = useParams().userId;
  useEffect(() => {//useEffect doesnt like a async function
      const getChallenges = async () => {
          try {
              const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/challenge`);
              //console.log(response);
              setLoadedChallenges(response.challenges);
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
  }, [sendRequest]);

  const [filteredRequirements, setFilteredRequirements] = useState([
    'yes',
    'no',
  ]); //TO DO after profile is implemented
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

  const requirementsFilterHandler = (event) => {
    const targetRequirements = event.target.value;
    //console.log(targetRequirements);
    let newFilteredRequirements;
    if (event.target.checked) {
      //something checked
      newFilteredRequirements = [...filteredRequirements];
      newFilteredRequirements.push(targetRequirements);
    } else {
      //something unchecked
      newFilteredRequirements = [...filteredRequirements].filter(
        (requirement) => requirement !== targetRequirements
      );
    }
    setFilteredRequirements(newFilteredRequirements);
    //console.log(filteredRequirements);
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
      {!isLoading && loadedChallenges && allLanguages && allTiers &&
        (
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
                      <input type='checkbox' value={lang} defaultChecked />
                        {" " + lang}
                      <br />
                    </>
                )}
              </div>

              <div onChange={tierFilterHandler}>
                <h4> Tier</h4>
                {allTiers.map(lang => 
                    <>
                      <input type='checkbox' value={lang} defaultChecked />
                        {" " + lang}
                      <br />
                    </>
                )}
              </div>

              {auth.token && (
                <div onChange={requirementsFilterHandler}>
                  <h4> Requirements </h4>
                  <input type='checkbox' value='yes' defaultChecked /> Yes <br />
                  <input type='checkbox' value='no' defaultChecked /> No
                </div>
              )}
            </div>
            <div>
              <ChallengeList
                items={loadedChallenges}
                hasFilters={hasFilters}
                filters={{
                  filteredLanguage,
                  filteredTier,
                  filteredRequirements,
                }}
              />
            </div>
          </div>
        )
      }
    </>
  );
};

export default Challenges;
