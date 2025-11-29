import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../components/providers/AuthProvider';
import { Link, useLoaderData } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';


const MyDonationCamp = () => {
  const { user } = useContext(AuthContext);
  const [donationCamp, setDonationCamp] = useState([]);
  const [viewDonatorsss, setviewDonatorsss] = useState([]);
  const [filteredDonationCamp, setFilteredDonationCamp] = useState([]);
  const [filteredDonator, setFilteredDonator] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  // const donation=useLoaderData();
  // const{_id,name,max_donation_limit,}=donation;
  const axiosSecure = useAxiosSecure();
  // const [allCamps,setAllCamps]=useState([])
  useEffect(() => {
    fetch('http://localhost:5007/adddonationcamp')
      .then(response => response.json())
      .then(data => setDonationCamp(data))
      .catch(error => console.error('Error fetching donation:', error));
  }, []);


// view donator
useEffect(() => {
  fetch('http://localhost:5007/payments')
    .then(response => response.json())
    .then(data => setviewDonatorsss(data))
    .catch(error => console.error('Error fetching donation:', error));
}, []);
console.log('myself filte',filteredDonator);
console.log('paymentsroute',viewDonatorsss);

useEffect(() => {
  if (user && user.email) {
   
    setFilteredDonator(viewDonatorsss.filter(viewdonator=>viewdonator.donationId==selectedDonation));
  }
}, [ user,viewDonatorsss,selectedDonation]);


console.log('filterfffff',filteredDonator);
useEffect(() => {
  if (user && user.email) {
    setFilteredDonationCamp(donationCamp.filter(donation => donation.userEmail === user.email));
    
  }
}, [donationCamp, user]);

  // const calculateProgress = (donated, max) => {
  //   console.log('Donated:', donated);
  //   console.log('Max:', max);
  //   return (donated / max) * 100;
  // };
  const calculateProgress = (donationId, max) => {
    const donatedAmount = viewDonatorsss.find(donation => donation.donationId === donationId)?.donationAmount || 0;
    return (donatedAmount / max) * 100;
  };

  const updatePetStatusLocally = (petId, newStatus) => {
    setFilteredDonationCamp((prevPets) =>
      prevPets.map((pet) =>
        pet._id === petId ? { ...pet, pause: newStatus } : pet
      )
    );
  };
  console.log('filter',filteredDonationCamp);
  const handleTogglePauseResume = (donation) => {
    const petId = donation._id;

    // Check if the donation is currently paused
    const isPaused = donation.pause;

    // Optimistically update the local state based on the action
    updatePetStatusLocally(petId, !isPaused);

    // Send the appropriate request based on the current status
    const request = isPaused
      ? axiosSecure.patch(`/admin/resume/${petId}`)
      : axiosSecure.patch(`/admin/pause/${petId}`);

    // Perform the request
    request
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount === 0) {
          // Revert the local state if the request fails
          updatePetStatusLocally(petId, isPaused);
          console.error('Failed to update pause/resume status.');
        } else {
          const actionMessage = isPaused ? 'Resumed' : 'Paused';
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Donation ${actionMessage} successfully`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        // Revert the local state if the request fails
        updatePetStatusLocally(petId, isPaused);
        console.error('Error updating pause/resume status:', error);
      });
  };

  



  const viewDonatorss = (donationId) => {
   
    setSelectedDonation(donationId);
  };

  const closeModal = () => {
    setSelectedDonation(null);
  };

  return (
    <div className="container mx-auto my-8 px-4">
  {/* Table */}
  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
    <thead>
      <tr className="bg-gray-100">
        <th className="py-3 px-6 border-b text-center font-semibold text-gray-700">Pet Name</th>
        <th className="py-3 px-6 border-b text-center font-semibold text-gray-700">Maximum Donation Amount</th>
        <th className="py-3 px-6 border-b text-center font-semibold text-gray-700">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredDonationCamp.map((donation) => (
        <tr key={donation._id} className="hover:bg-gray-50">
          <td className="py-3 px-6 border-b text-gray-800 text-center">{donation.name}</td>
          <td className="py-3 px-6 border-b text-center text-gray-800 font-semibold">
          ₹{donation.max_donation_limit}
          </td>
          <td className="py-3 px-6 border-b text-center">
            <Link to={`../updatedonationcamp/${donation._id}`}>
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full shadow-md transition duration-300">
                Edit
              </button>
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Modal for Donators */}
  {selectedDonation !== null && filteredDonator.length > 0 && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-8/12">
        <h2 className="font-semibold text-xl mb-4 text-center text-gray-800">Donators for Donation</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 border-collapse rounded-lg">
            <thead>
              <tr className="bg-pink-600 text-white">
                <th className="py-2 px-4 text-left">Serial</th>
                <th className="py-2 px-4 text-left">Donators</th>
                <th className="py-2 px-4 text-left">Donation Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonator.map((don, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-800">{index + 1}</td>
                  <td className="py-2 px-4 text-gray-800">{don.email}</td>
                  <td className="py-2 px-4 text-gray-800">{don.donationAmount}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md transition duration-300"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Message when there are no donors */}
  {selectedDonation !== null && filteredDonator.length === 0 && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-8/12 text-center">
        <p className="text-lg text-gray-800">No One Donated Yet</p>
        <div className="mt-4 flex justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full shadow-md transition duration-300"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default MyDonationCamp;
