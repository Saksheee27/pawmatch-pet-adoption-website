import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../components/providers/AuthProvider';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdoptionReq = () => {
  const [pets, setPets] = useState([]);
  const { user } = useContext(AuthContext);
  const [filteredCard, setFilteredCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    setLoading(true); // Start loading
    fetch(`http://localhost:5007/addtoadopt`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched pets:', data);
        setPets(data);
        setLoading(false); // End loading
      })
      .catch((error) => {
        setLoading(false); // End loading on error
        console.error('Error fetching adoption request pets:', error);
      });
  }, []);

  useEffect(() => {
    if (user && user.email) {
      setFilteredCard(pets.filter(pet => pet.ownerEmail === user.email && pet.adopt_Req === true));
    }
  }, [pets, user]);

  const updatePetStatusLocally = (petId, newStatus) => {
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet._id === petId ? { ...pet, adopted: newStatus } : pet
      )
    );
  };

  const handleAccept = (pet) => {
    const petId = pet._id;
    updatePetStatusLocally(petId, true);

    axiosSecure
      .patch(`/admin/accept/${petId}`, { petId: pet.petId, id: pet._id })
      .then((res) => {
        if (res.data.modifiedCount === 0) {
          updatePetStatusLocally(petId, false);
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Adoption Request Accepted',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        updatePetStatusLocally(petId, false);
        console.error('Error updating adoption status:', error);
      });
  };

  const handleReject = (pet) => {
    const petId = pet._id;
    updatePetStatusLocally(petId, false);

    axiosSecure
      .patch(`/admin/reject/${petId}`, { petId: pet.petId, id: pet._id })
      .then((res) => {
        if (res.data.modifiedCount === 0) {
          updatePetStatusLocally(petId, true);
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Adoption Request Rejected',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        updatePetStatusLocally(petId, true);
        console.error('Error rejecting adoption request:', error);
      });
  };

  if (loading) {
    return <div className="text-center text-xl">Loading adoption requests...</div>;
  }

  return (
    <div className="container mx-auto px-4 my-8">
      {filteredCard.length === 0 ? (
        <p className="text-center text-lg text-gray-500 mt-8">
          No adoption requests found. Please check back later.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">Requested By</th>
                <th className="py-3 px-6 text-left font-semibold">Phone</th>
                <th className="py-3 px-6 text-left font-semibold">Email</th>
                <th className="py-3 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCard.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-gray-800">{card.userName}</div>
                        <div className="text-sm text-gray-500">{card.userAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 border-b text-gray-700">{card.phone}</td>
                  <td className="py-3 px-6 border-b text-gray-700">{card.userEmail}</td>
                  <td className="py-3 px-6 border-b text-center">
                    <button
                      onClick={() => handleAccept(card)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 mx-1"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(card)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 mx-1"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdoptionReq;
