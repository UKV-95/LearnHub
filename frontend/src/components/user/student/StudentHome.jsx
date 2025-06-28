import React from 'react';
import AllCourses from '../../common/AllCourses';
import { Container } from 'react-bootstrap';

const StudentHome = () => {
   return (
      <Container className="my-4">
         <h2 className="mb-3">Available Courses</h2>
         <AllCourses />
      </Container>
   );
};

export default StudentHome;
