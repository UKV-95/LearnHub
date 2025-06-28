import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

const NavBar = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return null;  // Hide navbar for non-logged-in users
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");  // Redirect after logout
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand>
          <h3>Study App</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>

            <Nav.Link as={NavLink} to="/">Home</Nav.Link>

            {user.userData.type === 'Teacher' && (
              <Nav.Link as={NavLink} to="/teacher/addcourse">Add Course</Nav.Link>
            )}

            {user.userData.type === 'Admin' && (
              <Nav.Link as={NavLink} to="/admin/dashboard">Admin Dashboard</Nav.Link>
            )}

            {user.userData.type === 'Student' && (
              <Nav.Link as={NavLink} to="/student/enrolledcourses">Enrolled Courses</Nav.Link>
            )}

          </Nav>

          <Nav>
            <h5 className='mx-3'>Hi {user.userData.name}</h5>
            <Button onClick={handleLogout} size='sm' variant='outline-danger'>Log Out</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;