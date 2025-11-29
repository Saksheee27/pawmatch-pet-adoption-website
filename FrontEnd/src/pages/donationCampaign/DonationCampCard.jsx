/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const DonationCampCard = ({ card }) => {
  const { _id, image, max_donation_limit, last_donation_date, shortdesp } =
    card;
  return (
<div className="flex justify-center mt-12">
  <div className="relative flex flex-col bg-white shadow-2xl rounded-xl w-96 overflow-hidden transition-transform transform hover:scale-105 hover:shadow-3xl hover:translate-y-2 duration-300">
    {/* Image Section */}
    <div className="relative w-full h-64 bg-cover bg-center rounded-t-xl" style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-black opacity-30 rounded-t-xl"></div>
    </div>
    
    {/* Content Section */}
    <div className="p-6 space-y-4">
      {/* Donation Info */}
      <div className="flex items-center justify-between text-gray-700">
        <p className="text-sm font-medium">Last Date: <span className="font-semibold text-blue-600">{last_donation_date}</span></p>
        <p className="text-sm font-medium">Max Donation: <span className="font-semibold text-blue-600"> ₹{max_donation_limit}</span></p>
      </div>
      
      {/* Short Description */}
      <p className="text-sm text-gray-600 line-clamp-3">{shortdesp}</p>
    </div>

    {/* Button Section */}
    <div className="p-6 pt-0">
      <Link to={`/donationcampaigndetails/${_id}`}>
        <button className="w-full py-3 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          View Details
        </button>
      </Link>
    </div>
  </div>
</div>

  
  );
};

export default DonationCampCard;
