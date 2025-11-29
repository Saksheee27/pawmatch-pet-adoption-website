
import { useFormik } from "formik";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";

import { toast } from "react-toastify";

import axios from "axios";
import { AuthContext } from "../../../components/providers/AuthProvider";

const CreateDonationCampaign = () => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const saveImage = async () => {
    try {
      if (!image) {
        return toast.error("Please upload an image");
      }
  
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "petadding"); // Replace with your Cloudinary upload preset
      formData.append("cloud_name", "dtwz2gkbz"); // Replace with your Cloudinary cloud name
  
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dtwz2gkbz/image/upload", // Replace with your Cloudinary endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data && response.data.secure_url) {
        setUrl(response.data.secure_url);
        console.log(response.data.secure_url);
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
console.log('img',url);
  const initialValues = {
    name:"",
    max_donation_limit: "",
   date:"",
    shortdesp: "",
    longdesp: "",
    photo: "",
  };

  

  const { values,errors,touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    // validationSchema:addnewpet,
    onSubmit: async () => {
      try {
        await saveImage(); // Wait for the image to be saved before proceeding
        if (!url) {
            return toast.error("Image not uploaded successfully. Please try again.");
          }
        // Rest of the code for creating and submitting the new pet
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-US");
        const formattedTime = currentDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        });
  
        const newdonationcamp = {
          image: url || 'photo',
          name:values.name,
          max_donation_limit: values.max_donation_limit,
          
         last_donation_date:values.date,
          shortdesp: values.shortdesp,
          longdesp: values.longdesp,
        
          addedDate: `${formattedDate} ${formattedTime}`,
         
          userEmail: user.email,
          pause:false
        };
  
        const response = await fetch("http://localhost:5007/adddonationcamp", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(newdonationcamp),
        });
  
        console.log(newdonationcamp);
  
        const data = await response.json();
        console.log(data);
  
        if (data.insertedId) {
          Swal.fire({
            title: "Success!",
            text: "Donation Campaign Added Successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error adding camp:", error);
      }
    },
  });
  



  
    return (
      <div className="flex items-center justify-center p-12 w-full lg:w-10/12 mx-auto bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 mt-16 rounded-xl">
      <div className="mx-auto w-full max-w-[550px] shadow-lg p-6 rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          {/* Pet Image Upload */}
          <div className="flex flex-col mb-5">
            <label className="mb-3 text-base font-medium text-[#07074D]">Pet Image</label>
            <div className="flex justify-end items-center mb-5">
              <p className="mr-3 text-base font-medium">Image file:</p>
              <label htmlFor="file-upload" className="cursor-pointer flex justify-center items-center">
                {image ? (
                  <img
                    className="w-16 h-16 rounded-xl object-cover"
                    src={image ? URL.createObjectURL(image) : ""}
                    alt="Pet Image"
                  />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png"
                    className="w-12 h-12"
                    alt="Placeholder Icon"
                  />
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                name="photo"
                value={values.photo}
                onBlur={handleBlur}
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </div>
            {errors.photo && touched.photo && <p className="text-error">{errors.photo}</p>}
          </div>
    
          {/* Pet Name */}
          <div className="mb-5">
            <label htmlFor="name" className="mb-3 text-base font-medium text-[#07074D]">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Pet's Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.name && touched.name && <p className="text-error">{errors.name}</p>}
          </div>
    
          {/* Maximum Donation Amount */}
          <div className="mb-5">
            <label htmlFor="max_donation_limit" className="mb-3 text-base font-medium text-[#07074D]">Maximum Donation Amount</label>
            <input
              type="number"
              name="max_donation_limit"
              id="max_donation_limit"
              placeholder="Maximum Donation Limit"
              value={values.max_donation_limit}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.max_donation_limit && touched.max_donation_limit && <p className="text-error">{errors.max_donation_limit}</p>}
          </div>
    
          {/* Date */}
          <div className="mb-5">
            <label htmlFor="date" className="mb-3 text-base font-medium text-[#07074D]">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.date && touched.date && <p className="text-error">{errors.date}</p>}
          </div>
    
          {/* Short Description */}
          <div className="mb-5">
            <label htmlFor="shortdesp" className="mb-3 text-base font-medium text-[#07074D]">UPI ID</label>
            <input
              type="text"
              name="shortdesp"
              id="shortdesp"
              placeholder="UPI ID"
              value={values.shortdesp}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.shortdesp && touched.shortdesp && <p className="text-error">{errors.shortdesp}</p>}
          </div>
    
          {/* Long Description */}
          <div className="mb-5">
            <label htmlFor="longdesp" className="mb-3 text-base font-medium text-[#07074D]">Add Long Description</label>
            <textarea
              name="longdesp"
              id="longdesp"
              placeholder="Long Description"
              value={values.longdesp}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="4"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md resize-none"
            />
            {errors.longdesp && touched.longdesp && <p className="text-error">{errors.longdesp}</p>}
          </div>
    
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="hover:shadow-form rounded-md hover:bg-blue-400 py-3 px-8 text-center text-base font-semibold text-white outline-none w-full bg-[#ff0000]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
    
    );
};

export default CreateDonationCampaign;