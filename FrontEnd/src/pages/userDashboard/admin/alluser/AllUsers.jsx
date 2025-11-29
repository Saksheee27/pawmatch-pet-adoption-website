import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    axiosSecure
      .get("/users")
      .then((res) => {
        console.log("Fetched users:", res.data);
        setUsers(res.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [axiosSecure]);

  const handleMakeAdmin = (user) => {
    if (user.role === "Admin") {
      Swal.fire({
        title: "Already an Admin",
        text: `${user.name} is already an Admin.`,
        icon: "info",
      });
      return;
    }

    axiosSecure
      .patch(`/users/admin/${user._id}`)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            title: "Success!",
            text: `${user.name} is now an Admin`,
            icon: "success",
          });

          // Update state immediately
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u._id === user._id ? { ...u, role: "Admin" } : u
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error updating role:", error);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
          icon: "error",
        });
      });
  };

  return (
    <div className="p-6 bg-pink-100 min-h-screen">
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="p-6 border-b bg-[#D52B5C] text-white">
      <h2 className="text-xl font-bold">User Management</h2>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="text-left px-6 py-4">Profile Image</th>
            <th className="text-left px-6 py-4">Name</th>
            <th className="text-left px-6 py-4">Email</th>
            <th className="text-left px-6 py-4">Role</th>
            <th className="text-center px-6 py-4">Change Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-pink-50 border-b transition duration-300"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border shadow">
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 font-medium">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "Admin"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {user.role === "Admin" ? (
                  <span className="text-sm text-gray-400 italic">Admin</span>
                ) : (
                  <button
                    onClick={() => handleMakeAdmin(user)}
                    className="btn btn-xs bg-[#D52B5C] hover:bg-[#b5244f] text-white"
                  >
                    Make Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
};

export default AllUsers;
