import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category" }, //creates a parent-child relationship between categories.
  //type: mongoose.Types.ObjectId: indicates that this field will store a reference to another document’s unique ID within the same or a different collection
  //ref: "Category": it tells Mongoose that the ObjectId stored in the parent field references a document in the "Category" collection.
  //This enables Mongoose to automatically handle population of the field, meaning it can replace the ObjectId with the actual document it refers to when you query for categories and use the .populate() method.
  properties: [{ type: Object }],
});

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
