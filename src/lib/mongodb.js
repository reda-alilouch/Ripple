import mongoose from "mongoose";

// Add error handling and connection state check
export const connectMongoDB = async () => {
  try {
    // Check if we're already connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB is already connected");
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    
    // Add more detailed logging
    console.log("Successfully connected to MongoDB");
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Database name:", mongoose.connection.name);

    // Add connection event listeners
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected event fired");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:");
    console.error("Error details:", error);
    throw error; // Re-throw the error for proper error handling
  }
};

