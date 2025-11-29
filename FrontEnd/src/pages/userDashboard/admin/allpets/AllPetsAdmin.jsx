import React from "react";
import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useEffect } from "react";
import { MdArrowDropDown } from "react-icons/md";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AllPetsAdmin = () => {
  const [pets, setPets] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetch(`http://localhost:5007/pets`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setPets(data);
      })
      .catch((error) => console.error("Error fetching my added pets:", error));
  }, []);

  const updatePetStatusLocally = (petId, newStatus) => {
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet._id === petId ? { ...pet, adopted: newStatus } : pet
      )
    );
  };

  const handleChangeAdopted = (pet) => {
    const petId = pet._id;

    // Optimistically update the local state
    updatePetStatusLocally(petId, true);

    axiosSecure
      .patch(`/admin/adopted/${petId}`)
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
            title: "Change the adoption Status successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        // Revert the local state if the request fails
        updatePetStatusLocally(petId, false);
        console.error("Error updating adoption status:", error);
      });
  };

  const handleChangeNotAdopted = (pet) => {
    const petId = pet._id;

    // Optimistically update the local state
    updatePetStatusLocally(petId, false);

    axiosSecure
      .patch(`/admin/notadopted/${petId}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount === 0) {
          // Revert the local state if the request fails
          updatePetStatusLocally(petId, true);
          console.error("Failed to update adoption status.");
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Change the adoption Status successfully",
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
        fetch(`http://localhost:5007/pets/${_id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Pet deleted successfully:", data);
            setPets((prevPets) => prevPets.filter((pet) => pet._id !== _id));
          })
          .catch((error) => console.error("Error deleting pet:", error));
      }
    });
  };
  return (
<div className="p-6 bg-pink-100 min-h-screen">
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="p-6 border-b bg-[#D52B5C] text-white">
      <h2 className="text-xl font-bold">Manage Pets</h2>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="text-left px-6 py-4">Pet Image</th>
            <th className="text-left px-6 py-4">Category</th>
            <th className="text-left px-6 py-4">Name</th>
            <th className="text-left px-6 py-4">Adoption Status</th>
            <th className="text-center px-6 py-4">Change Status</th>
            <th className="text-center px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {pets.map((pet) => (
            <tr
              key={pet._id}
              className="hover:bg-pink-50 border-b transition duration-300"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border">
                    <img
                      src={pet.image}
                      alt="Pet"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">{pet.category}</td>
              <td className="px-6 py-4 font-medium">{pet.name}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    pet.adopted
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {pet.adopted ? "Adopted" : "Not Adopted"}
                </span>
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <button
                  onClick={() => handleChangeAdopted(pet)}
                  className={`btn btn-xs ${
                    pet.adopted
                      ? "btn-disabled"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                  disabled={pet.adopted}
                >
                  Adopted
                </button>
                <button
                  onClick={() => handleChangeNotAdopted(pet)}
                  className={`btn btn-xs ${
                    !pet.adopted
                      ? "btn-disabled"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  disabled={!pet.adopted}
                >
                  Not Adopted
                </button>
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <Link to={`../updatepet/${pet._id}`}>
                  <button className="btn btn-xs bg-yellow-500 hover:bg-yellow-600 text-white">
                    Update
                  </button>
                </Link>
                <button
                  onClick={() => deletePet(pet._id)}
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

export default AllPetsAdmin;
