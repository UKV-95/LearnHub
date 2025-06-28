const express = require("express");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middlewares/authMiddleware");

const {
  registerController,
  loginController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  getAllCoursesController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
} = require("../controllers/userControllers");

const router = express.Router();

// ✅ Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

// ✅ File Filter for .mp4 and image files
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedExts = [".mp4", ".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return cb(new Error("Only .mp4 videos or allowed images are accepted"));
    }
    cb(null, true);
  }
});


// ✅ Public Routes
router.post("/register", registerController);
router.post("/login", loginController);

// ✅ Protected Routes
router.post(
  "/addcourse",
  authMiddleware,
  upload.any(), // Use .any() to accept dynamic keys like sections[0][S_content]
  postCourseController
);

router.get("/getallcourses", getAllCoursesController);

router.get("/getallcoursesteacher", authMiddleware, getAllCoursesUserController);

router.delete("/deletecourse/:courseid", authMiddleware, deleteCourseController);

router.post("/enrolledcourse/:courseid", authMiddleware, enrolledCourseController);

router.get("/coursecontent/:courseid", authMiddleware, sendCourseContentController);

router.post("/completemodule", authMiddleware, completeSectionController);

router.get("/getallcoursesuser", authMiddleware, sendAllCoursesUserController);


// ✅ Export the Router
module.exports = router;