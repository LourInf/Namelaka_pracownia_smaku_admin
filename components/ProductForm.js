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
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false); //pics uploading spinner
  const [loading, setLoading] = useState(false); // categories loading spinner
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const router = useRouter();

  //fetches all the categories so we can later show them as options in the select input
  useEffect(() => {
    setLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setLoading(false);
    });
  }, []);

  //this function first prevents page reload, then gathers form data into an object
  //and sends this data to my server's endpoint using axios put (to edit an existing product, if it has an id)
  //or post (to create a new product) method
  async function saveProduct(e) {
    e.preventDefault();
    //first we do a simple form validation --> Ensuring that form data is valid before attempting to save can prevent unnecessary API requests and improve data integrity.
    if (!title.trim() || !price) {
      alert("Title and price are required.");
      return;
    }

    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

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

  function handleSetProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  //I want a category to show all the properties of the selected category, plus all the properties of its parent categories
  //so we can accumulate all those properties into 1 array, propertiesToFill
  const propertiesToFill = [];
  //First check if the categories (array of object) has a valid length and category (string, id) exists
  if (categories.length > 0 && category) {
    // //here we loop through categories and try to find the category where _id is the same as the selected category (remember category is an id)
    let selectedCatInfo = categories.find(({ _id }) => _id === category);
    // console.log({ selectedCatInfo }); //selectedCatInfo is an object with info of the selected category
    // And we add the properties of the found category to the accumulator array
    propertiesToFill.push(...selectedCatInfo.properties);
    // Now we loop to find if the selected category has a parent id, if it does then we know the selected category has a parent and we try to find
    // as well the info as previously we did, using now the parent id of the current category
    while (selectedCatInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === selectedCatInfo?.parent?._id
      );
      // And if the parent category has properties, we include them too to the accumulator array.
      propertiesToFill.push(...parentCat.properties);
      // The parent category now becomes the new selectedCatInfo for the next iteration
      selectedCatInfo = parentCat;
    }
    //This loop repeats, checking the category hierarchy checking again if a category has a parent. If no more parent category,loop stops. This way we can gather properties from the entire lineage of the selected category into propertiesToFill
  }
  //and now we can display the aggregated properties dynamically in a div.

  function removeImageByUrl(imageUrl) {
    setImages((currentImages) =>
      currentImages.filter((img) => img !== imageUrl)
    );
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
          categories.map((categ) => (
            <option key={categ._id} value={categ._id}>
              {categ.name}
            </option>
          ))}
      </select>
      {/*Here we display all properties. Reminder: good practice to use a key prop when rendering elemns in React! */}
      {loading && <Spinner />}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p, index) => (
          <div key={p.id || index}>
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <select
              value={productProperties[p.name] || ""}
              onChange={(e) => handleSetProductProp(p.name, e.target.value)}
              required
            >
              <option value="" disabled>
                Select a {p.name}
              </option>{" "}
              {p.values.map((val, valIndex) => (
                <option key={valIndex} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          className=" flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="relative h-24 shadow-md w-full">
                <img src={link} alt="" className="rounded-lg w-full h-full" />
                <button
                  onClick={() => removeImageByUrl(link)}
                  className="absolute  right-0 top-0 text-white bg-red-300 rounded p-1"
                  style={{ fontSize: "18px", lineHeight: "18px", zIndex: 10 }}
                >
                  &times;
                </button>
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
          className="w-24 h-24 flex items-center justify-center shadow-md text-gray-500 rounded-lg bg-gray-200 cursor-pointer  hover:bg-gray-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 hover:w-6 hover:h-6 transition"
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
