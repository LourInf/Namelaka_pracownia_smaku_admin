import mongoose from "mongoose";

//1. Schema definition:
//1.1. Destructure Schema from mongoose for defining schemas
const { Schema } = mongoose;

//1.2 Define the schema (structure) for the "Product" doc in MongoDB db (data type, required fields,etc)
const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});

//2. Model creation: Mongoose compiles this schema into a model ("Product") or uses an existing one if it already exists
export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
