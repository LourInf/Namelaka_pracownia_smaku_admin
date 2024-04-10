import Layout from "@/components/Layout";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Categories() {
  const [name, setName] = useState(""); // For the category name input
  const [categories, setCategories] = useState([]); // For storing fetched categories
  const [parentCategory, setParentCategory] = useState(""); // For storing the parent category selection
  const [editedCategory, setEditedCategory] = useState(null); // For tracking the currently edited category
  const [properties, setProperties] = useState([]); // For storing properties

  //To fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data); // Update state with fetched data
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
      title: "Are you sure?",
      text: `Do you want to delete ${category.name} category?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d55",
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
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
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
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={addProperty}
          >
            Add new property
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
                  placeholder="property name (example: color)"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValuesChange(index, property, e.target.value)
                  }
                  placeholder="values, comma separated"
                />
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="btn-default"
                >
                  Remove
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
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent Category</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category, index) => (
                <tr key={index}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-primary mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
