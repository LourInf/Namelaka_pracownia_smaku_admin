import mongoose from "mongoose";

const { Schema } = mongoose;

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
});

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
