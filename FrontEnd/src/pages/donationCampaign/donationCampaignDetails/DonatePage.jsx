import React from "react";
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";

const DonatePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const upi = queryParams.get("upi");

  // Validate if UPI ID exists
  if (!upi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-pink-700 mb-6">Error</h1>
        <p className="text-lg font-medium text-gray-800">
          No valid UPI ID found. Please check the link and try again.
        </p>
      </div>
    );
  }

  const upiURI = `upi://pay?pa=${upi}&pn=Donation&cu=INR`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upi).then(() => {
      alert("UPI ID copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">Scan to Donate</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-pink-700 flex flex-col items-center">
        <QRCode value={upiURI} size={256} />
        <p className="mt-4 text-lg font-medium text-gray-800">
          UPI ID: <span className="text-pink-700">{upi}</span>
        </p>

        <button
          onClick={handleCopy}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
        >
          Copy UPI ID
        </button>
      </div>
    </div>
  );
};

export default DonatePage;
