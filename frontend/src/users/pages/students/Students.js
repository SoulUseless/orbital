import React, { useState, useEffect } from "react";

import StudentList from '../../components/students/StudentList';
import { useHttpClient } from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

const Students = (props) => {
  const [students, setStudents] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  useEffect(() => {
    const getStudents = async () => {
        try {
            const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/student`);
            setStudents(response.students);
        } catch (err) {
            console.log(err);
        }
    };
    getStudents();
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
          {!isLoading && students && <StudentList items={students} />}
      </>
  );
};

export default Students;
