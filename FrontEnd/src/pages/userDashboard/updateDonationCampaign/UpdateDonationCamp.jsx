import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../../components/providers/AuthProvider';

const UpdateDonationCamp = () => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { donationCampaignId } = useParams();

  const [initialValues, setInitialValues] = useState({
    max_donation_limit: '',
    date: '',
    shortdesp: '',
    longdesp: '',
    photo: '',
  });

  useEffect(() => {
    const fetchDonationCampaign = async () => {
      try {
        const response = await fetch(`http://localhost:5007/adddonationcamp/${donationCampaignId}`);
        const data = await response.json();

        setInitialValues({
          max_donation_limit: data.max_donation_limit,
          date: data.last_donation_date,
          shortdesp: data.shortdesp,
          longdesp: data.longdesp,
          photo: data.image,
        });
        setUrl(data.image);
      } catch (error) {
        console.error("Error fetching donation campaign details:", error);
      }
    };

    fetchDonationCampaign();
  }, [donationCampaignId]);

  const saveImage = async () => {
    if (!image) return; // If no image selected, skip upload

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'petadding');
    formData.append('cloud_name', 'dtwz2gkbz');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dtwz2gkbz/image/upload', formData);
      if (response.data.secure_url) {
        setUrl(response.data.secure_url);
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    onSubmit: async () => {
      try {
        // Wait for image upload if image is selected
        if (image) {
          await saveImage();
        }
        if (!url && !image) {
          return toast.error("Image not uploaded successfully. Please try again.");
        }

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-US");
        const formattedTime = currentDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        });

        const updatedDonationCamp = {
          image: url || 'photo', // Default image if URL is not available
          name: values.name, // Include name from form values
          max_donation_limit: values.max_donation_limit,
          last_donation_date: values.date,
          shortdesp: values.shortdesp,
          longdesp: values.longdesp,
          addedDate: `${formattedDate} ${formattedTime}`,
          userEmail: user.email,
          Pause: false, // Adjust if needed
        };
        

        const response = await fetch(`http://localhost:5007/updatedonationcamp/${donationCampaignId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDonationCamp),
        });

        const data = await response.json();

        if (data.updated) {
          Swal.fire({
            title: "Success!",
            text: "Donation Campaign Updated Successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
          navigate('/'); // Redirect after successful update
        }
      } catch (error) {
        console.error("Error updating donation camp:", error);
      }
    },
  });

  return (
    <div className="flex items-center justify-center p-12 w-full lg:w-10/12 mx-auto bg-gradient-to-r from-pink-200 via-purple-300 to-blue-200 mt-16 rounded-xl shadow-lg">
  <div className="mx-auto w-full max-w-[550px] bg-white p-8 rounded-xl shadow-xl border border-[#f1f1f1]">
    <form onSubmit={handleSubmit}>
      {/* Pet Image */}
      <div className="flex justify-center mb-6">
        <div className="w-full">
          <label className="mb-3 block text-xl font-semibold text-[#3c4a76]">Pet Image</label>
          <div className="flex justify-center items-center mb-5">
            <p className="text-sm text-gray-500 mr-2">Image file:</p>
            <label htmlFor="file-upload" className="cursor-pointer rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all">
              {image ? (
                <img className="w-20 h-20 rounded-full object-cover" src={URL.createObjectURL(image)} alt="img" />
              ) : (
                <img src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png" className="w-12 h-12" />
              )}
            </label>
            <input
              id="file-upload"
              className="text-white file-input file-input-bordered w-full max-w-xs mt-2 hidden"
              type="file"
              name="photo"
              value={values.photo}
              onBlur={handleBlur}
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          {errors.photo && touched.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
        </div>
      </div>

      {/* Name */}
      <div className="mb-5">
        <label htmlFor="name" className="mb-3 block text-base font-semibold text-[#3c4a76]">Update Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter Campaign Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:ring-2 focus:ring-[#6A64F1] shadow-md transition-all"
        />
        {errors.name && touched.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Maximum Donation Amount */}
      <div className="mb-5">
        <label htmlFor="max_donation_limit" className="mb-3 block text-base font-semibold text-[#3c4a76]">Maximum Donation Amount</label>
        <input
          type="number"
          name="max_donation_limit"
          id="max_donation_limit"
          placeholder="Maximum Donation Limit"
          value={values.max_donation_limit}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:ring-2 focus:ring-[#6A64F1] shadow-md transition-all"
        />
        {errors.max_donation_limit && touched.max_donation_limit && <p className="text-red-500 text-sm">{errors.max_donation_limit}</p>}
      </div>

      {/* Date */}
      <div className="mb-5">
        <label htmlFor="date" className="mb-3 block text-base font-semibold text-[#3c4a76]">Event Date</label>
        <input
          type="date"
          name="date"
          id="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:ring-2 focus:ring-[#6A64F1] shadow-md transition-all"
        />
        {errors.date && touched.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>

      {/* Short Description */}
      <div className="mb-5">
        <label htmlFor="shortdesp" className="mb-3 block text-base font-semibold text-[#3c4a76]">Short Description</label>
        <input
          type="text"
          name="shortdesp"
          id="shortdesp"
          placeholder="Short Description"
          value={values.shortdesp}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:ring-2 focus:ring-[#6A64F1] shadow-md transition-all"
        />
        {errors.shortdesp && touched.shortdesp && <p className="text-red-500 text-sm">{errors.shortdesp}</p>}
      </div>

      {/* Long Description */}
      <div className="mb-5">
        <label htmlFor="longdesp" className="mb-3 block text-base font-semibold text-[#3c4a76]">Long Description</label>
        <textarea
          name="longdesp"
          id="longdesp"
          placeholder="Long Description"
          value={values.longdesp}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:ring-2 focus:ring-[#6A64F1] shadow-md transition-all resize-none"
        />
        {errors.longdesp && touched.longdesp && <p className="text-red-500 text-sm">{errors.longdesp}</p>}
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-3 px-8 text-base font-semibold text-white rounded-md bg-gradient-to-r from-[#ff4081] to-[#ff0000] hover:bg-gradient-to-l focus:ring-2 focus:ring-[#ff0000] shadow-md hover:shadow-lg transition-all"
        >
          Update Donation Campaign
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default UpdateDonationCamp;
