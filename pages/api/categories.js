import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req; // Extract the HTTP method from the incoming request
  await mongooseConnect(); //first we need to ensure connection to our db before doing any operation!

  //GET requests: we want to fetch all the category documents from the db
  if (method === "GET") {
    res.json(await Category.find().populate("parent")); // `.populate("parent")` is used to replace the parent category's ObjectId with its document so we can retrieve the full information of parent categories.
  }

  if (method === "POST") {
    let { name, parentCategory, properties } = req.body; // Extract necessary data from the request body
    // const categoryDoc = await Category.create({ name, parent: parentCategory });
    // res.json(categoryDoc);

    try {
      // Create a new category doc with the provided name and parent category
      const categoryDoc = await Category.create({
        name,
        parent: parentCategory || undefined, // ensure that the parent field is either set to a valid ObjectId or not set at all, preventing runtime error because MongoDB expects an ObjectId, not an empty string (which is the case when "No parent category" is selected).
        properties,
      });
      res.json(categoryDoc); // Respond with the newly created category doc
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  if (method === "PUT") {
    let { name, parentCategory, properties, _id } = req.body; // // Here we also need to extract the document's ID
    // If parentCategory is an empty string, set it to null

    try {
      await Category.updateOne(
        { _id },
        {
          name,
          parent: parentCategory || undefined, // same as writing parentCategory===''? undefined :parentCategory
          properties,
        }
      );
      res.json({ message: "Category updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  if (method === "DELETE") {
    const { _id } = req.query; //for deleting we just need to extract the document's ID
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}
