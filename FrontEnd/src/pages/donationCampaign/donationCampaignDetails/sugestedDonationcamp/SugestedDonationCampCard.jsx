/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const SugestedDonationCampCard = ({ card }) => {
  const { _id, image, max_donation_limit, shortdesp } = card;

  // Check if card is undefined before destructuring
  if (!card) {
    return <div>Error: Card data is undefined</div>;
  }
  return (
    <div className="max-w-xs mx-auto mt-6">
      <div className="relative flex flex-col text-gray-700 bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ease-in-out">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden shadow-lg bg-blue-gray-500">
          <img
            src={image}
            alt="card-image"
            className="object-cover w-full h-full transform transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h5 className="mb-2 text-xl font-semibold text-blue-gray-900 tracking-tight">
            ₹{max_donation_limit}
          </h5>
          <p className="text-base text-gray-700 mb-4">{shortdesp}</p>
        </div>

        {/* Button Section */}
        <div className="p-6 pt-0">
          <Link to={`/donationcampaign`}>
            <button
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-lg font-bold text-sm uppercase shadow-md transition-all duration-300 ease-in-out hover:from-pink-700 hover:to-pink-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              type="button"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SugestedDonationCampCard;
