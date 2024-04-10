import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || "");
  const router = useRouter();

  //fetches all the categories so we can later show them as options in the select input
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  //this function first prevents page reload, then gathers form data into an object
  //and sends this data to my server's endpoint using axios put (to edit an existing product, if it has an id)
  //or post (to create a new product) method
  async function saveProduct(e) {
    const data = { title, description, price, images, category };
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

  async function uploadImages(e) {
    // console.log(e);
    const files = e.target?.files; // Accessing the selected files from the event
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData(); // Creating a FormData object to hold the files
      for (const file of files) {
        data.append("file", file); // Appending each selected file to the FormData object
      }
      // Sending the FormData to the server
      const res = await axios.post("/api/upload", data);
      //console.log(res.data); //inside data we have "links", so we will add it to a state
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links]; //this will create a new array with the old images plus new ones
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    //console.log(images);
    setImages(images);
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
      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">No category</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          className=" flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {/*by using htmlFor="file-upload" we connect the label to the file input using id <input id="file-upload"...>
         Clicking the label triggers the file input dialog to open, allowing the user to select a file. */}
        {isUploading && (
          <div className="h-24 p-1 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <label
          htmlFor="file-upload"
          className="w-24 h-24 flex items-center justify-center text-gray-500 rounded-lg bg-gray-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple // Allow multiple file selection
          onChange={uploadImages}
        />
      </div>
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
