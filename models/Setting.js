import mongoose from "mongoose";

const { Schema } = mongoose;

const SettingSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Object },
  adText: { type: String }, //field for custom text
  subAdText: { type: String },
});

export const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
