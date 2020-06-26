import React from 'react';

import StudentItem from './StudentItem';
import Card from '../../../shared/components/UIElements/Card';
import './StudentList.css';

const StudentList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No student found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className='student-list'>
      {props.items.map((student) => (
        <StudentItem
          key={student.id}
          id={student.id}
          image={student.profilePicture}
          name={student.name}
          email={student.email}
        />
      ))}
    </ul>
  );
};

export default StudentList;
