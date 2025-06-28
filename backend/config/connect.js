const mongoose = require("mongoose");

const connectionOfDb = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "video-course-application", // use your desired DB name
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
      process.exit(1); // Exit the app if DB connection fails
    });
};

module.exports = connectionOfDb;