/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const PetListingCard = ({ card }) => {
  const { _id, image, name, age, location, category, addedDate } = card;

  return (
<div className="mx-5 my-5">
  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-sm mx-auto">
    <figure className="w-full h-60 overflow-hidden bg-gray-100">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </figure>
    <div className="p-5 space-y-3">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        🐾 {name}
      </h2>
      <p className="text-gray-600">Age: <span className="font-medium">{age}</span></p>
      <p className="text-gray-600">Location: <span className="font-medium">{location}</span></p>
      <p className="text-gray-600">Category: <span className="font-medium">{category}</span></p>
      <p className="text-gray-500 text-sm">Added: {addedDate}</p>
      <div className="pt-4 flex justify-end">
        <Link to={`../adoptpet/${_id}`}>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-300 transform hover:scale-105">
            View Details
          </button>
        </Link>
      </div>
    </div>
  </div>
</div>

  );
};

export default PetListingCard;




