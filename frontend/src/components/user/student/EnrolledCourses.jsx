import React, { useEffect, useState } from 'react';
import axiosInstance from '../../common/AxiosInstance';
import { Link } from 'react-router-dom';
import {
   Button,
   styled,
   TableRow,
   TableHead,
   TableContainer,
   Paper,
   Table,
   TableBody,
   TableCell,
   tableCellClasses,
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
   },
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const EnrolledCourses = () => {
   const [allEnrolledCourses, setAllEnrolledCourses] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchCourses = async () => {
      try {
         const res = await axiosInstance.get('api/user/getallcoursesuser', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllEnrolledCourses(res.data.data);
         } else {
            alert(res.data.message);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchCourses();
   }, []);

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="left">Course Name</StyledTableCell>
                  <StyledTableCell align="left">Course Educator</StyledTableCell>
                  <StyledTableCell align="left">Course Category</StyledTableCell>
                  <StyledTableCell align="left">Action</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {loading ? (
                  <TableRow>
                     <TableCell colSpan={5} align="center">
                        Loading courses...
                     </TableCell>
                  </TableRow>
               ) : allEnrolledCourses.length > 0 ? (
                  allEnrolledCourses.map((course) => (
                     <StyledTableRow key={course._id}>
                        <StyledTableCell component="th" scope="row">
                           {course._id}
                        </StyledTableCell>
                        <StyledTableCell>{course.C_title}</StyledTableCell>
                        <StyledTableCell>{course.C_educator}</StyledTableCell>
                        <StyledTableCell>{course.C_categories}</StyledTableCell>
                        <StyledTableCell>
                           <Link to={`/courseSection/${course._id}/${encodeURIComponent(course.C_title)}`}>
                              <Button size="small" variant="contained" color="success">
                                 Go To
                              </Button>
                           </Link>
                        </StyledTableCell>
                     </StyledTableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={5} align="center">
                        You have not enrolled in any courses yet.
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

export default EnrolledCourses;
