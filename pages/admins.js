import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";

export default function Admins() {
  const [showForm, setShowForm] = useState(false); // control form visibility
  const [admins, setAdmins] = useState([]); // Initial admin list
  const [adminEmail, setAdminEmail] = useState(""); // hold new admin email
  const [loading, setLoading] = useState(false); //For spinner

  //form submission
  const saveAdmin = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/admins", { email: adminEmail })
      .then((res) => {
        console.log(res.data);
        setAdmins((prevAdmins) => [...prevAdmins, res.data]); // Add new admin to the list
        setAdminEmail(""); // Clear the input field
        setShowForm(false); // Hide the form after adding the admin
        Swal.fire({
          text: `${adminEmail} added as new admin`,
          icon: "success",
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 409) {
          Swal.fire({
            text: "This admin already exists!",
            icon: "error",
          });
        } else {
          Swal.fire({
            text: "Failed to add new admin",
            icon: "error",
          });
        }
      });
  };

  async function deleteAdmin(adminId, adminEmail) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete ${adminEmail}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f87171", // Tailwind's red-500
      cancelButtonColor: "#6c757d", // Bootstrap's secondary color
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // User clicked 'Yes, delete it!'
      try {
        await axios.delete(`/api/admins?_id=${adminId}`);
        // Update local state to reflect the change
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin._id !== adminId)
        );
        Swal.fire("Deleted!", "The admin has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete the admin:", error);
        Swal.fire("Error!", "There was an issue deleting the admin.", "error");
      }
    }
  }

  useEffect(() => {
    axios
      .get("/api/admins")
      .then((res) => {
        setAdmins(res.data); // res.data=array of admin objects
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching admins:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <h1>Admins</h1>
      <div className="mb-4">
        <label className="block">Add New Admin</label>
        <button
          type="button"
          className="bg-custom-green text-white font-semibold text-xl py-2 pb-2.5 px-4 rounded-full inline-flex items-center justify-center mt-2 mb-3 hover:bg-custom-dark-green hover:font-bold transition"
          onClick={() => setShowForm(!showForm)} // Toggle form visibility
        >
          +
        </button>
      </div>
      {showForm && (
        <form onSubmit={saveAdmin} className="mb-6">
          <div className="flex gap-1">
            <input
              className="border rounded-lg text-base py-2 px-4 h-10 align-middle"
              type="text"
              placeholder="Enter admin google email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary h-10 align-middle ml-2"
            >
              Save
            </button>
          </div>
        </form>
      )}
      <table className="basic w-full mt-3">
        <thead>
          <tr>
            <th className="text-left">Admin Google Email</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={2} className="text-center">
                <Spinner />
              </td>
            </tr>
          )}
          {admins.length > 0 &&
            admins.map((admin, index) => (
              <tr key={index}>
                <td>{admin.email}</td>
                <td>
                  <button onClick={() => editAdmin(admin._id)} className="pl-3">
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
                  <button onClick={() => deleteAdmin(admin._id, admin.email)}>
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
          {!loading && admins.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center">
                No admins found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
}
