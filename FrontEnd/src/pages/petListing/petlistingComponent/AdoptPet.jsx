import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../components/providers/AuthProvider";
import { Link, useLoaderData } from "react-router-dom";
import Navbar from "../../../shared/navbar/Navbar";
import Footer from "../../../shared/footer/Footer";

const AdoptPet = () => {
  const details = useLoaderData();
  const { user } = useContext(AuthContext);
  const [phone, setPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  console.log(details);

  const {
    _id,
    name,
    location,
    category,
    image,
    age,
    longdesp,
    shortdesp,
    userEmail,
  } = details;
  console.log("addpet", name, image);
  const handleAddToCart = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;

    // const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    // const day = String(currentDate.getDate()).padStart(2, '0');
    // const formattedDate = `${year}-${month}-${day}`;

    // const adoptDate = selectedDate;

    // if (!adoptDate) {
    // //   document.getElementById('my_modal_4').close();
    //   // If return date is not selected, show an alert
    //   Swal.fire({
    //     title: 'Error!',
    //     text: 'Please select a adopt date',
    //     icon: 'error',
    //     confirmButtonText: 'Ok',
    //   });
    //   return; // Stop further execution
    // }

    const addtoadopt = {
      userEmail: user?.email,
      userName: user?.displayName,
      adoptDate: formattedDate,
      userAddress: userAddress,
      phone: phone,
      ownerEmail: userEmail,
      petId: _id,
      name,
      category,
      image,
      longdesp,
      shortdesp,
      adopt_Req: true,
      // adopted:false,
    };

    // Close the modal before making the fetch request
    document.getElementById("my_modal_4").close();

    fetch("http://localhost:5007/addtoadopt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addtoadopt), // Fix the variable name here
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          Swal.fire({
            title: "Success!",
            text: " Addopt request send Successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />

        {/* Pet Details Card */}
        <div className="mt-32 px-6">
          <div className="card lg:card-side bg-white shadow-2xl rounded-xl w-full max-w-6xl mx-auto my-20 overflow-hidden">
            <figure className="w-full lg:w-1/2 h-full">
              <img
                src={image}
                alt={name}
                className="object-cover w-full h-full max-h-[500px] lg:max-h-[600px] object-center"
              />
            </figure>
            <div className="card-body p-8 w-full lg:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="card-title text-3xl font-semibold text-gray-800 mb-4">
                  {name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{shortdesp}</p>
                <div className="space-y-2">
                  <p className="text-md text-gray-700 font-medium">
                    Age: <span className="text-pink-500">{age}</span>
                  </p>
                  <p className="text-md text-gray-700 font-medium">
                    Location: <span className="text-pink-500">{location}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-4">{longdesp}</p>
              </div>

              {/* Send Request Button */}
              <div className="mt-6">
                <button
                  onClick={() =>
                    document.getElementById("my_modal_4").showModal()
                  }
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
                >
                  Send Adoption Request
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Modal Form */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-full max-w-xl rounded-xl shadow-lg p-6 bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            📝 Adoption Request Form
          </h3>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                defaultValue={user?.displayName}
                readOnly
                className="w-full rounded-md border border-gray-300 px-4 py-2 bg-gray-50 text-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                defaultValue={user?.email}
                readOnly
                className="w-full rounded-md border border-gray-300 px-4 py-2 bg-gray-50 text-gray-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="modal-action flex justify-center mt-6 gap-4">
            <form method="dialog" className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                onClick={handleAddToCart}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
              >
                Submit
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <Footer />
    </div>
  );
};

export default AdoptPet;
