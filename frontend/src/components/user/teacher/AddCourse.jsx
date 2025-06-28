import React, { useState, useContext } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';

const AddCourse = () => {
   const user = useContext(UserContext);
   const [addCourse, setAddCourse] = useState({
      userId: user.userData._id,
      C_educator: '',
      C_title: '',
      C_categories: '',
      C_price: '',
      C_description: '',
      sections: [],
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setAddCourse({ ...addCourse, [name]: value });
   };

   const handleCourseTypeChange = (e) => {
      setAddCourse({ ...addCourse, C_categories: e.target.value });
   };

   const addInputGroup = () => {
      setAddCourse({
         ...addCourse,
         sections: [
            ...addCourse.sections,
            {
               S_title: '',
               S_description: '',
               S_content: null,
            },
         ],
      });
   };

   const handleChangeSection = (index, e) => {
      const updatedSections = [...addCourse.sections];
      const sectionToUpdate = updatedSections[index];

      if (e.target.name === 'S_content') {
         sectionToUpdate.S_content = e.target.files[0];
      } else {
         sectionToUpdate[e.target.name] = e.target.value;
      }

      setAddCourse({ ...addCourse, sections: updatedSections });
   };

   const removeInputGroup = (index) => {
      const updatedSections = [...addCourse.sections];
      updatedSections.splice(index, 1);
      setAddCourse({
         ...addCourse,
         sections: updatedSections,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();

      // Append main course fields
      formData.append('userId', addCourse.userId);
      formData.append('C_educator', addCourse.C_educator);
      formData.append('C_title', addCourse.C_title);
      formData.append('C_categories', addCourse.C_categories);
      formData.append('C_price', addCourse.C_price);
      formData.append('C_description', addCourse.C_description);

      // Append sections
      addCourse.sections.forEach((section, index) => {
         formData.append(`sections[${index}][S_title]`, section.S_title);
         formData.append(`sections[${index}][S_description]`, section.S_description);
         if (section.S_content instanceof File) {
            formData.append(`sections[${index}][S_content]`, section.S_content);
         }
      });

      try {
         const res = await axiosInstance.post('/api/user/addcourse', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });

         if (res.data.success) {
            alert(res.data.message);
            // Optionally reset form after success
            setAddCourse({
               userId: user.userData._id,
               C_educator: '',
               C_title: '',
               C_categories: '',
               C_price: '',
               C_description: '',
               sections: [],
            });
         } else {
            alert('Failed to create course');
         }
      } catch (error) {
         console.error('An error occurred:', error);
         alert('An error occurred while creating the course. Make sure your files are .mp4 videos or allowed images.');
      }
   };

   return (
      <div>
         <Form className="mb-3" onSubmit={handleSubmit}>
            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridCourseType">
                  <Form.Label>Course Type</Form.Label>
                  <Form.Select
                     value={addCourse.C_categories}
                     onChange={handleCourseTypeChange}
                     required
                  >
                     <option value="" disabled>Select categories</option>
                     <option>IT & Software</option>
                     <option>Finance & Accounting</option>
                     <option>Personal Development</option>
                  </Form.Select>
               </Form.Group>
               <Form.Group as={Col} controlId="formGridCourseTitle">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                     name='C_title'
                     value={addCourse.C_title}
                     onChange={handleChange}
                     type="text"
                     placeholder="Enter Course Title"
                     required
                  />
               </Form.Group>
            </Row>

            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridEducator">
                  <Form.Label>Course Educator</Form.Label>
                  <Form.Control
                     name='C_educator'
                     value={addCourse.C_educator}
                     onChange={handleChange}
                     type="text"
                     placeholder="Enter Course Educator"
                     required
                  />
               </Form.Group>
               <Form.Group as={Col} controlId="formGridPrice">
                  <Form.Label>Course Price (Rs.)</Form.Label>
                  <Form.Control
                     name='C_price'
                     value={addCourse.C_price}
                     onChange={handleChange}
                     type="text"
                     placeholder="For free course, enter 0"
                     required
                  />
               </Form.Group>
               <Form.Group as={Col} controlId="formGridDescription">
                  <Form.Label>Course Description</Form.Label>
                  <Form.Control
                     name='C_description'
                     value={addCourse.C_description}
                     onChange={handleChange}
                     as="textarea"
                     placeholder="Enter Course description"
                     required
                  />
               </Form.Group>
            </Row>

            <hr />

            {addCourse.sections.map((section, index) => (
               <div key={index} className="d-flex flex-column mb-4 border rounded-3 border-3 p-3 position-relative">
                  <span
                     style={{ cursor: 'pointer', position: 'absolute', top: '5px', right: '10px', fontSize: '1.2rem' }}
                     onClick={() => removeInputGroup(index)}
                  >
                     ❌
                  </span>

                  <Row className='mb-3'>
                     <Form.Group as={Col} controlId={`sectionTitle${index}`}>
                        <Form.Label>Section Title</Form.Label>
                        <Form.Control
                           name='S_title'
                           value={section.S_title}
                           onChange={(e) => handleChangeSection(index, e)}
                           type="text"
                           placeholder="Enter Section Title"
                           required
                        />
                     </Form.Group>

                     <Form.Group as={Col} controlId={`sectionContent${index}`}>
                        <Form.Label>Section Content (Video/Image)</Form.Label>
                        <Form.Control
                           name='S_content'
                           onChange={(e) => handleChangeSection(index, e)}
                           type="file"
                           accept="video/*,image/*"
                           required
                        />
                     </Form.Group>
                  </Row>

                  <Form.Group controlId={`sectionDescription${index}`}>
                     <Form.Label>Section Description</Form.Label>
                     <Form.Control
                        name='S_description'
                        value={section.S_description}
                        onChange={(e) => handleChangeSection(index, e)}
                        as="textarea"
                        placeholder="Enter Section description"
                        required
                     />
                  </Form.Group>
               </div>
            ))}

            <Row className="mb-3">
               <Col>
                  <Button size='sm' variant='outline-secondary' onClick={addInputGroup}>
                     ➕ Add Section
                  </Button>
               </Col>
            </Row>

            <Button variant="primary" type="submit">
               Submit
            </Button>
         </Form>
      </div>
   );
};

export default AddCourse;
