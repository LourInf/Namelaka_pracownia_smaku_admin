import mongoose from "mongoose";

const { Schema } = mongoose;

const CarouselSettingSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    default: "carouselImages",
  },
  images: [{ type: String }], // Array to store image URLs
});

export const CarouselSetting =
  mongoose.models.CarouselSetting ||
  mongoose.model("CarouselSetting", CarouselSettingSchema);
