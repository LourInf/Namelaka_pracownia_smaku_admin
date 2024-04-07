import Layout from "@/components/Layout";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Categories() {
  const [name, setName] = useState(""); // For the category name input
  const [categories, setCategories] = useState([]); // For storing fetched categories
  const [parentCategory, setParentCategory] = useState(""); // For storing the parent category selection
  const [editedCategory, setEditedCategory] = useState(null); // For tracking the currently edited category

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
    const data = { name, parentCategory };
    // If we're editing a category, send a PUT request
    if (editedCategory) {
      await axios.put("/api/categories", { ...data, _id: editedCategory._id });
      setEditedCategory(null);
      // If we're creating a new category, send a POST request
    } else {
      await axios.post("/api/categories", data);
    }
    setName(""); // Reset the input fields
    fetchCategories(); // Refresh the list of categories
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
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

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="mb-0"
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
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
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
    </Layout>
  );
}
