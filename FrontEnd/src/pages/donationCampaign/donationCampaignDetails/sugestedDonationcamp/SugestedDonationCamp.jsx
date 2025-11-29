import React, { useEffect, useState } from "react";
import SugestedDonationCampCard from "./SugestedDonationCampCard";

const SugestedDonationCamp = () => {
  const [donationCamp, setDonationCamp] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5007/adddonationcamp`)
      .then((response) => response.json())
      .then((data) => setDonationCamp(data))
      .catch((error) => console.error("Error fetching donation:", error));
  }, []);
  console.log(donationCamp);
  return (
    <div>
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10 lg:my-20 gap-6 px-4">
          {donationCamp.slice(0, 3).map((card) => (
            <div
              key={card._id}
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40"
            >
              <SugestedDonationCampCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SugestedDonationCamp;
