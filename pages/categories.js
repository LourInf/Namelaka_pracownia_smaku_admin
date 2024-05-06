import Layout from "@/components/Layout";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import Spinner from "@/components/Spinner";

export default function Categories() {
  const [name, setName] = useState(""); // For the category name input
  const [categories, setCategories] = useState([]); // For storing fetched categories
  const [parentCategory, setParentCategory] = useState(""); // For storing the parent category selection
  const [editedCategory, setEditedCategory] = useState(null); // For tracking the currently edited category
  const [properties, setProperties] = useState([]); // For storing properties
  const [loading, setLoading] = useState(false); //For spinner

  //To fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data); // Update state with fetched data
      setLoading(false);
    });
  }

  // handles form submission for both creating and updating categories
  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        //A category can have various properties. Properties are an array of objects where each object has info (name and values) about a single property
        name: property.name,
        values: property.values.split(","), // holds an array of values for that property. As we enter these values as a comma-separated string in the form, we need to convert this string into an array of values with the split method ( splits the string into an array at each comma, effectively separating the individual values)
      })),
    };
    // If we're editing a category, send a PUT request
    if (editedCategory) {
      await axios.put("/api/categories", { ...data, _id: editedCategory._id });
      setEditedCategory(null);
      // If we're creating a new category, send a POST request
    } else {
      await axios.post("/api/categories", data);
    }
    setName(""); // Reset the input fields
    setParentCategory("");
    setProperties([]);
    fetchCategories(); // Refresh the list of categories
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  async function deleteCategory(category) {
    // Call SweetAlert2 to confirm deletion
    const result = await Swal.fire({
      text: `Do you really want to delete ${category.name} category?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(248 113 113)",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // User clicked 'Yes, delete it!'
      try {
        await axios.delete(`/api/categories?_id=${category._id}`);
        fetchCategories(); // Fetch categories to update the list after deletion
        Swal.fire("Deleted!", "The category has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an issue deleting the category.",
          "error"
        );
      }
    }
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    // console.log({ index, property, newName });
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    // console.log({ index, property, newName });
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>{editedCategory ? "Categories - Edit" : "Categories"}</h1>
      <label>
        {editedCategory ? (
          <span>
            Edit category
            <span className="font-semibold pl-1">{editedCategory.name}</span>
          </span>
        ) : (
          "Create new category"
        )}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            className=""
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className=""
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No group category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Add Properties</label>
          <button
            type="button"
            className="bg-custom-green text-white font-semibold text-xl py-2 pb-2.5 px-4 rounded-full inline-flex items-center justify-center mt-2 mb-3 hover:bg-custom-dark-green hover:font-bold transition"
            onClick={addProperty}
          >
            +
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  onChange={(e) =>
                    handlePropertyNameChange(index, property, e.target.value)
                  }
                  placeholder="property name (ej: size)"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValuesChange(index, property, e.target.value)
                  }
                  placeholder="values, comma separated (ej: S, M, L)"
                />
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className=""
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 text-red-400 icon-scale"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  {/*Delete*/}
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default  py-1 mt-5 mb-7"
            >
              Cancel editing
            </button>
          )}
          <button type="submit" className="btn-primary py-1 mt-5 mb-7">
            Save changes
          </button>
        </div>
      </form>
      {!editedCategory && (
        <div className="bg-neutral-50 rounded-lg pt-1 pb-2 px-5 shadow-md">
          <table className="basic cat mt-4">
            <thead>
              <tr>
                <th>Category</th>
                <th>Group Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4}>
                    <div className="flex justify-center items-center">
                      <Spinner />
                    </div>
                  </td>
                </tr>
              )}
              {categories.length > 0 &&
                categories.map((category, index) => (
                  <tr key={index}>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td>
                      <button
                        onClick={() => editCategory(category)}
                        className="pl-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                          stroke="currentColor"
                          className="w-6 h-6 text-stone-400 icon-scale"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        {/*Edit*/}
                      </button>
                      <button onClick={() => deleteCategory(category)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                          stroke="currentColor"
                          className="w-6 h-6 text-red-400 icon-scale"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                        {/*Delete*/}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
