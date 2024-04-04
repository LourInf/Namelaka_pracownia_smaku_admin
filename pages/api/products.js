// Import Product model for database & mongooseConnect function to ensure db connection
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

//handles incoming request to this API route (api/products)
export default async function handle(req, res) {
  // res.status(200).json(req.method); //we use it at first to test if it works (check in Network response)
  //1.Extract the HTTP method from the request object
  const { method } = req;
  //2.First we need to establish a connection to MongoDB database calling function mongooseConnect
  await mongooseConnect();
  //3.If the request method is a post, create new product
  if (method === "POST") {
    //3.1.Extract title, description, and price from the request body
    const { title, description, price } = req.body;
    //3.2.Document creation: use Product model to create a new doc in the database with the provided data
    //The model "Product" acts as a constructor for creating a new document (Product.create()) that matches the ProductSchema schema
    const productDoc = await Product.create({ title, description, price });
    //3.3. The client (browser) receives the JSON response containing the newly created product.
    //Having this response, we can use it to display a success message, update the UI, or redirect the user to another page,
    // whatever the action, it would need to be implemented in the createProduct function after the axios request (in new.js)!
    res.json(productDoc);
  }
}
