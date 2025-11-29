import React from "react";
import { useLoaderData } from "react-router-dom";

import SugestedDonationCamp from "./sugestedDonationcamp/SugestedDonationCamp";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../userDashboard/payment/CheckoutForm";
import Navbar from "../../../shared/navbar/Navbar";
import Footer from "../../../shared/footer/Footer";
import { useNavigate } from "react-router-dom";

const DonationCampaignDetails = () => {
  const campdetails = useLoaderData();
  const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

  const {
    image,
    shortdesp,
    longdesp,
    last_donation_date,
    max_donation_limit,
    pause,
  } = campdetails;

  const navigate = useNavigate();

  const handleDonateClick = () => {
    navigate(`/donate?upi=${encodeURIComponent(shortdesp)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="relative flex flex-col items-center lg:flex-row bg-white shadow-xl border-2 border-pink-700 rounded-xl mx-auto p-10 mt-20 w-full max-w-4xl">
        {/* Left Section (Image) */}
        <div className="relative w-full lg:w-2/5 rounded-xl overflow-hidden shadow-lg mb-6 lg:mb-0 lg:mr-10">
          <img
            src={image}
            alt="card-image"
            className="object-cover w-full h-full rounded-lg border-4 border-pink-700 transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Right Section (Content) */}
        <div className="lg:w-3/5 p-6 lg:border-l-2 border-pink-700 text-gray-700">
          <h6 className="text-lg font-semibold text-pink-700 mb-4">
            Last Date:{" "}
            <span className="font-bold text-gray-900">
              {last_donation_date}
            </span>
          </h6>
          <h4 className="text-2xl font-semibold text-gray-900 mb-4">
            Max Donation Amount:{" "}
            <span className="text-pink-700 font-bold">
              ₹{max_donation_limit}
            </span>
          </h4>
          <p className="text-base text-gray-700 mb-4">
            UPI ID: <span className="font-medium">{shortdesp}</span>
          </p>
          <p className="text-base text-gray-700 mb-6">Details: {longdesp}</p>
          <button
            onClick={handleDonateClick}
            className="mt-4 px-6 py-2 bg-pink-700 text-white font-semibold rounded-lg hover:bg-pink-800 transition"
          >
            Donate Now
          </button>
        </div>
      </div>

      {/* Suggested Donations */}
      <div className="flex flex-col items-center justify-center mt-12 text-3xl font-bold">
        <h3 className="text-pink-700">Suggested For You</h3>
        <p className="text-xl bg-green-500 px-6 py-2 mt-4 rounded-md text-white">
          Donate More
        </p>
      </div>
      <SugestedDonationCamp />

      <Footer />
    </div>
  );
};

export default DonationCampaignDetails;
