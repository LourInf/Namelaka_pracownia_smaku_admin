import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  //this function first prevents page reload, then gathers form data into an object
  //and sends this data to my server's endpoint using axios post method
  async function createProduct(e) {
    e.preventDefault();
    const data = { title, description, price };
    await axios.post("/api/products", data);
    //after a new product is created, i want to redirect back to product page and show the product and its data
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New Product</h1>
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
    </Layout>
  );
}
