import mongoose from "mongoose";

//ensuresthere's a connection to MongoDB
//It checks if a connection already exists (readyState === 1) to avoid reconnecting
//If not connected, it connects to the db using the connection URI from .env
export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(uri);
  }
}
