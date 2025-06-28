import React, { useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';

const TeacherHome = () => {
   const [allCourses, setAllCourses] = useState([]);

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get('/api/user/getallcoursesteacher', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.error('An error occurred while fetching courses:', error);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
   }, []);

   const toggleDescription = (courseId) => {
      setAllCourses((prevCourses) =>
         prevCourses.map((course) =>
            course._id === courseId
               ? { ...course, showFullDescription: !course.showFullDescription }
               : course
         )
      );
   };

   const deleteCourse = async (courseId) => {
      const confirmation = window.confirm('Are you sure you want to delete this course?');
      if (!confirmation) return;

      try {
         const res = await axiosInstance.delete(`/api/user/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });

         if (res.data.success) {
            alert(res.data.message);
            getAllCoursesUser();  // Refresh course list after delete
         } else {
            alert('Failed to delete the course.');
         }
      } catch (error) {
         console.error('An error occurred while deleting the course:', error);
         alert('An error occurred while deleting the course.');
      }
   };

   return (
      <Container className="card-container my-4">
         {allCourses.length > 0 ? (
            allCourses.map((course) => (
               <Card key={course._id} className="mb-4 shadow-sm">
                  <Card.Body>
                     <Card.Title>{course.C_title}</Card.Title>
                     <Card.Text>
                        <p>
                           <strong>Description:</strong>{' '}
                           {course.showFullDescription
                              ? course.C_description
                              : `${course.C_description.slice(0, 100)}${course.C_description.length > 100 ? '...' : ''}`}{' '}
                           {course.C_description.length > 100 && (
                              <span
                                 onClick={() => toggleDescription(course._id)}
                                 style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                              >
                                 {course.showFullDescription ? 'Read Less' : 'Read More'}
                              </span>
                           )}
                        </p>
                        <p>
                           <strong>Category:</strong> {course.C_categories}
                        </p>
                        <p>
                           <strong>Sections:</strong> {course.sections.length}
                        </p>
                        <p style={{ color: '#6c757d' }}>
                           <strong>Enrolled students:</strong> {course.enrolled}
                        </p>
                     </Card.Text>
                     <div className="text-end">
                        <Button variant="danger" size="sm" onClick={() => deleteCourse(course._id)}>
                           Delete
                        </Button>
                     </div>
                  </Card.Body>
               </Card>
            ))
         ) : (
            <p>No courses found!</p>
         )}
      </Container>
   );
};

export default TeacherHome;
