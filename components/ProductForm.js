import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  //this function first prevents page reload, then gathers form data into an object
  //and sends this data to my server's endpoint using axios put (to edit an existing product, if it has an id)
  //or post (to create a new product) method
  async function saveProduct(e) {
    const data = { title, description, price };
    e.preventDefault();
    //first we do a simple form validation --> Ensuring that form data is valid before attempting to save can prevent unnecessary API requests and improve data integrity.
    if (!title.trim() || !price) {
      alert("Title and price are required.");
      return;
    }

    if (_id) {
      //update the product with that id
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create a new product
      await axios.post("/api/products", data);
    }
    //after a product is created or a product is edited, i want to redirect back to product page and show the product and its data
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in PLN)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
