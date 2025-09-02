import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UsersPage() {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/user/",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setUser(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // delete user
  async function deleteUser(userID) {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/user/" + userID,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      // update UI without refreshing
      setUser((prevUsers) => prevUsers.filter((u) => u._id !== userID));

      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete User. Please try again."
      );
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-b-white border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Admin Accounts */}
          <section className="mb-16">
            <h1 className="text-3xl font-extrabold text-center mb-2 text-[#d8232a] tracking-wide">
              Admin Accounts
            </h1>
            <hr className="mb-8 border-[#f9a825]" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {user
                .filter((u) => u.role === "admin")
                .map((admin) => (
                  <div
                    key={admin._id}
                    className="bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] shadow-xl rounded-2xl p-5 flex items-center justify-between transition-transform hover:scale-105"
                  >
                    <div className="flex items-center">
                      <img
                        src="../../../admin.png"
                        alt="admin"
                        className="w-16 h-16 rounded-full mr-5 border-4 border-[#1976d2] bg-white shadow"
                      />
                      <div>
                        <div className="font-bold text-[#1976d2] text-lg">
                          {admin.name}
                        </div>
                        <div className="text-sm text-gray-700">
                          {admin.email}
                        </div>
                        <div className="text-sm text-gray-700">
                          {admin.phoneNumber}
                        </div>
                        <div className="text-xs font-bold text-[#388e3c] mt-2 uppercase tracking-wider">
                          {admin.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Link
                        to="/admin/edituser"
                        state={admin}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xl hover:bg-blue-600 transition"
                      >
                        <MdOutlineEdit />
                      </Link>
                      <button
                        onClick={() => deleteUser(admin._id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-xl hover:bg-red-600 transition"
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Postman Accounts */}
          <section className="mb-16">
            <h1 className="text-3xl font-extrabold text-center mb-2 text-[#3523d8] tracking-wide">
              Postman Accounts
            </h1>
            <hr className="mb-8 border-[#f9a825]" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {user
                .filter((u) => u.role === "postman")
                .map((postman) => (
                  <div
                    key={postman._id}
                    className="bg-gradient-to-br from-[#e3f2fd] to-[#e1bee7] shadow-xl rounded-2xl p-5 flex items-center justify-between transition-transform hover:scale-105"
                  >
                    <div className="flex items-center">
                      <img
                        src="../../../postman-icon.png"
                        alt="postman"
                        className="w-16 h-16 rounded-full mr-5 border-4 border-[#1976d2] bg-white shadow"
                      />
                      <div>
                        <div className="font-bold text-[#1976d2] text-lg">
                          {postman.name}
                        </div>
                        <div className="text-sm text-gray-700">
                          {postman.email}
                        </div>
                        <div className="text-sm text-gray-700">
                          {postman.phoneNumber}
                        </div>
                        <div className="text-xs font-bold text-[#388e3c] mt-2 uppercase tracking-wider">
                          {postman.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Link
                        to="/admin/edituser"
                        state={postman}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xl hover:bg-blue-600 transition"
                      >
                        <MdOutlineEdit />
                      </Link>
                      <button
                        onClick={() => deleteUser(postman._id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-xl hover:bg-red-600 transition"
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Customer Accounts */}
          <section>
            <h1 className="text-3xl font-extrabold text-center mb-2 text-[#388e3c] tracking-wide">
              Customer Accounts
            </h1>
            <hr className="mb-8 border-[#1976d2]" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {user
                .filter((u) => u.role === "user")
                .map((customer) => (
                  <div
                    key={customer._id}
                    className="bg-gradient-to-br from-[#f1f8e9] to-[#c8e6c9] shadow-xl rounded-2xl p-5 flex items-center justify-between transition-transform hover:scale-105"
                  >
                    <div className="flex items-center">
                      <img
                        src="../../../user.png"
                        alt="User"
                        className="w-16 h-16 rounded-full mr-5 border-4 border-[#388e3c] bg-white shadow"
                      />
                      <div>
                        <div className="font-bold text-[#388e3c] text-lg">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-700">
                          {customer.email}
                        </div>
                        <div className="text-sm text-gray-700">
                          {customer.phoneNumber}
                        </div>
                        <div className="text-xs font-bold text-[#1976d2] mt-2 uppercase tracking-wider">
                          {customer.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Link
                        to="/admin/edituser"
                        state={customer}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xl hover:bg-blue-600 transition"
                      >
                        <MdOutlineEdit />
                      </Link>
                      <button
                        onClick={() => deleteUser(customer._id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-xl hover:bg-red-600 transition"
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default UsersPage;