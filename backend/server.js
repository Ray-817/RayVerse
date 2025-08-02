/**
 * @fileoverview Main Server: Connects to the database and starts the Express application.
 * @description This file handles database connection and graceful shutdown for unhandled promise rejections.
 * @author Ray Jiang
 * @version 1.0.1
 */

// Load environment variables from .env file.
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const app = require("./app");

// Handle unhandled promise rejections to prevent the app from crashing.
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  // Close the server and then exit the process.
  server.close(() => {
    process.exit(1);
  });
});

// Build the database connection string.
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Define the server port, using a default value if not specified.
const port = process.env.PORT || 3030;

let server;

// Connect to the database and start the server.
const startServer = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Cloud DB connected!");
    // Start listening for requests only after a successful database connection.
    server = app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed!", error);
    // If the database connection fails, exit the process.
    process.exit(1);
  }
};

startServer();
