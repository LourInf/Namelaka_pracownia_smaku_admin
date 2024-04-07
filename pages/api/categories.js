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
    const { name, parentCategory } = req.body; // Extract necessary data from the request body
    const categoryDoc = await Category.create({ name, parent: parentCategory }); // Create a new category doc with the provided name and parent category
    res.json(categoryDoc); // Respond with the newly created category doc
  }

  if (method === "PUT") {
    const { name, parentCategory, _id } = req.body; // // Here we also need to extract the document's ID
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query; //for deleting we just need to extract the document's ID
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}
