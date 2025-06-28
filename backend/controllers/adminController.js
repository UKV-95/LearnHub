const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");

// ✅ Get All Users
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find();
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).send({ success: false, message: "No users found" });
    }
    res.status(200).send({ success: true, data: allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// ✅ Get All Courses
const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).send({ success: false, message: "No courses found" });
    }
    res.status(200).send({ success: true, data: allCourses });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// ✅ Delete Course
const deleteCourseController = async (req, res) => {
  const { courseid } = req.params;
  try {
    const course = await courseSchema.findByIdAndDelete(courseid);
    if (course) {
      res.status(200).send({ success: true, message: "Course deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Course not found" });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// ✅ Delete User
const deleteUserController = async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await userSchema.findByIdAndDelete(userid);
    if (user) {
      res.status(200).send({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
};