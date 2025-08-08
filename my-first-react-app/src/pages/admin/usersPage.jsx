import axios from 'axios';
import React, { useEffect, useState } from 'react'

function UsersPage() {
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    //get all users
    useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setIsLoading(true);
      });
  }, []);

return (
  <>
    {isLoading ? (
      <div className="flex justify-center items-center w-full h-full">
        <div className="animate-spin rounded-full h-13 w-13 border-4 border-b-white border-blue-500"></div>
      </div>
    ) : (
      <div>
        <div>
          <h1 className="text-2xl font-bold text-center my-4 text-[#d8232a]">
            Admin Accounts
          </h1>
          <hr className="my-4 border-[#f9a825]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user
              .filter((u) => u.role === "admin")
              .map((admin) => (
                <div
                  key={admin._id}
                  className="bg-[#e3f2fd] shadow-lg rounded-xl p-3 flex items-center "
                >
                  <img
                    src="../../../admin.png"
                    alt="admin"
                    className="w-16 h-16 rounded-full mr-4 border-4 border-[#1976d2] bg-white"
                  />
                  <div>
                    <div className="font-semibold text-[#1976d2]">
                      {admin.name}
                    </div>
                    <div className="text-sm text-gray-700">{admin.email}</div>
                    <div className="text-sm text-gray-700">
                      {admin.phoneNumber}
                    </div>
                    <div className="text-xs font-bold text-[#388e3c] mt-1">
                      {admin.role}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h1 className="mt-[100px] text-2xl font-bold text-center my-4 text-[#3523d8]">
            Postman Accounts
          </h1>
          <hr className="my-4 border-[#f9a825]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user
              .filter((u) => u.role === "postman")
              .map((postman) => (
                <div
                  key={postman._id}
                  className="bg-[#e3f2fd] shadow-lg rounded-xl p-3 flex items-center "
                >
                  <img
                    src="../../../admin.png"
                    alt="admin"
                    className="w-16 h-16 rounded-full mr-4 border-4 border-[#1976d2] bg-white"
                  />
                  <div>
                    <div className="font-semibold text-[#1976d2]">
                      {postman.name}
                    </div>
                    <div className="text-sm text-gray-700">{postman.email}</div>
                    <div className="text-sm text-gray-700">
                      {postman.phoneNumber}
                    </div>
                    <div className="text-xs font-bold text-[#388e3c] mt-1">
                      {postman.role}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h1 className="mt-[100px] text-2xl font-bold text-center my-4 text-[#388e3c]">
            Customer Accounts
          </h1>
          <hr className="my-4 border-[#1976d2]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {user
              .filter((u) => u.role === "user")
              .map((customer) => (
                <div
                  key={customer._id}
                  className="bg-[#f1f8e9] shadow-lg rounded-xl p-3 flex items-center"
                >
                  <img
                    src="../../../user.png"
                    alt="User"
                    className="w-16 h-16 rounded-full mr-4 border-4 border-[#388e3c] bg-white"
                  />
                  <div>
                    <div className="font-semibold text-[#388e3c]">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-700">
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-700">
                      {customer.phoneNumber}
                    </div>
                    <div className="text-xs font-bold text-[#1976d2] mt-1">
                      {customer.role}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default UsersPage