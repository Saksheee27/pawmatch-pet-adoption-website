import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/providers/AuthProvider";
import Swal from "sweetalert2";
// import lottie from '../../../hooks/useLottie';
// import { useLottie } from 'lottie-react';

const MyDonation = () => {
  const { user } = useContext(AuthContext);
  // const lottie=useLottie();
  const [mydonations, setMyDonations] = useState([]);

  const [filteredPets, setFilteredPets] = useState([]);
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const petsPerPage = 10;
  const pagesVisited = currentPage * petsPerPage;

  // useEffect(() => {
  //   fetch(`https://pawmatch-server.vercel.app/pets`)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('Fetched pets:', data);
  //       setPets(data);
  //     })
  //     .catch(error => console.error('Error fetching my added pets:', error));
  // }, []);

  useEffect(() => {
    fetch(`http://localhost:5007/payments`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched payments:", data);
        setMyDonations(data);
      })
      .catch((error) => console.error("Error fetching payments:", error));
  }, []);

  useEffect(() => {
    user &&
      user?.email &&
      setFilteredPets(mydonations.filter((pet) => pet.email === user?.email));
  }, [mydonations, user]);

  const deletePet = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5007/payments/${_id}`, {
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
    <div className="p-6 min-h-screen bg-pink-50">
  <div className="bg-white m-6 rounded-2xl shadow-md overflow-x-auto">
    <div className="p-6 border-b bg-[#D52B5C] text-white rounded-t-2xl">
      <h2 className="text-xl font-bold">My Donations</h2>
    </div>

    <table className="table-auto w-full text-sm text-gray-700">
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
        <tr>
          <th className="text-left px-6 py-4">Pet Image</th>
          <th className="text-left px-6 py-4">Name</th>
          <th className="text-left px-6 py-4">Donation Amount</th>
          <th className="text-center px-6 py-4">Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredPets.map((donation) => (
          <tr
            key={donation._id}
            className="border-b hover:bg-pink-50 transition duration-200"
          >
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border shadow">
                  <img
                    src={donation.image}
                    alt={donation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </td>
            <td className="px-6 py-4 font-medium">{donation.name}</td>
            <td className="px-6 py-4 font-semibold text-green-600">
              ₹ {donation.donationAmount}
            </td>
            <td className="px-6 py-4 text-center">
              <button
                className="btn btn-sm text-white bg-gradient-to-r from-pink-700 to-pink-300 hover:from-pink-800 hover:to-pink-400 transition-all duration-200"
                onClick={() => deletePet(donation._id)}
              >
                Ask for Refund
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default MyDonation;
