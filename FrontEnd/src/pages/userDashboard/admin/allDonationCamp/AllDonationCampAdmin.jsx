import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllDonationCampAdmin = () => {
  const [allCamps, setAllCamps] = useState([]);

  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    fetch(`http://localhost:5007/adddonationcamp`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setAllCamps(data);
      })
      .catch((error) =>
        console.error("Error fetching my added donationcamp:", error)
      );
  }, []);

  const deletePet = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5007/adddonationcamp/${_id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Donation deleted successfully:", data);
            setAllCamps((prevPets) =>
              prevPets.filter((pet) => pet._id !== _id)
            );
          })
          .catch((error) =>
            console.error("Error deleting donation camp:", error)
          );
      }
    });
  };
  const updatePetStatusLocally = (petId, newStatus) => {
    setAllCamps((prevPets) =>
      prevPets.map((pet) =>
        pet._id === petId ? { ...pet, pause: newStatus } : pet
      )
    );
  };
  const handlePause = (pet) => {
    const petId = pet._id;

    // Optimistically update the local state
    updatePetStatusLocally(petId, true);

    axiosSecure
      .patch(`/admin/pause/${petId}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount === 0) {
          // Revert the local state if the request fails
          updatePetStatusLocally(petId, false);
          console.error("Failed to update adoption status.");
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "You Have Pause The Donation successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        // Revert the local state if the request fails
        updatePetStatusLocally(petId, false);
        console.error("Error updating pause status:", error);
      });
  };

  const handleResume = (pet) => {
    const petId = pet._id;

    // Optimistically update the local state
    updatePetStatusLocally(petId, false);

    axiosSecure
      .patch(`/admin/resume/${petId}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount === 0) {
          // Revert the local state if the request fails
          updatePetStatusLocally(petId, true);
          console.error("Failed to update pause status.");
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "You Have Resume The Donation successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        // Revert the local state if the request fails
        updatePetStatusLocally(petId, true);
        console.error("Error updating adoption status:", error);
      });
  };
  return (
    <div className="p-6 bg-pink-100 min-h-screen">
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="p-6 border-b bg-[#D52B5C] text-white">
      <h2 className="text-xl font-bold">All Donation Campaigns</h2>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="text-left px-6 py-4">Pet Image</th>
            <th className="text-left px-6 py-4">Max Donation</th>
            <th className="text-left px-6 py-4">Added By</th>
            <th className="text-left px-6 py-4">Last Donation Date</th>
            <th className="text-center px-6 py-4">Status</th>
            <th className="text-center px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {allCamps.map((allCamp) => (
            <tr key={allCamp._id} className="hover:bg-pink-50 border-b transition duration-300">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border">
                    <img src={allCamp.image} alt="Pet" className="w-full h-full object-cover" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-green-700">
                ₹{allCamp.max_donation_limit}
              </td>
              <td className="px-6 py-4 text-blue-500">{allCamp.userEmail}</td>
              <td className="px-6 py-4">{allCamp.last_donation_date}</td>
              <td className="px-6 py-4 text-center space-x-2">
                <button
                  onClick={() => handlePause(allCamp)}
                  className={`btn btn-xs ${
                    allCamp.pause ? 'btn-disabled' : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  disabled={allCamp.pause === true}
                >
                  Pause
                </button>
                <button
                  onClick={() => handleResume(allCamp)}
                  className={`btn btn-xs ${
                    !allCamp.pause ? 'btn-disabled' : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  disabled={allCamp.pause === false}
                >
                  Resume
                </button>
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <Link to={`../updatedonationcamp/${allCamp._id}`}>
                  <button className="btn btn-xs bg-yellow-500 hover:bg-yellow-600 text-white">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => deletePet(allCamp._id)}
                  className="btn btn-xs bg-[#D52B5C] hover:bg-[#b5244f] text-white"
                >
                  Delete
                </button>
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

export default AllDonationCampAdmin;
