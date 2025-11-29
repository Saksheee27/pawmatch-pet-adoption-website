import { useFormik } from "formik";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import { AuthContext } from "../../components/providers/AuthProvider";
import { toast } from "react-toastify";
import { addnewpet } from "../../components/schemas";
import axios from "axios";

const AddPet = () => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const saveImage = async () => {
    try {
      if (!image) {
        toast.error("Please upload an image");
        return null;
      }
  
      const formData = new FormData();
      formData.append("image", image);
  
      const response = await axios.post("https://api.imgbb.com/1/upload?key=29ed998057179793c7af0eeb8fb8f2de", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      if (response.data.status === 200) {
        return response.data.data.url;  // ✅ Return the uploaded image URL
      } else {
        toast.error("Image upload failed. Please try again.");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

console.log('img',url);
  const initialValues = {
    name: "",
    age: "",
    category: "",
    location: "",
    shortdesp: "",
    longdesp: "",
    photo: "",
  };

  const handleCategorySelectChange = (selectedOption) => {
    setCategory(selectedOption);
    setFieldValue("category", selectedOption.value);
  };
  

  const categoryOptions = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Bird", label: "Bird" },
    { value: "Rabbit", label: "Rabbit" },
    { value: "Fish", label: "Fish" },
    { value: "Hamster", label: "Hamster" },
    { value: "Turtle", label: "Turtle" },
    { value: "Other", label: "Other" },
  ];

  const { values,errors,touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    // validationSchema:addnewpet,
    onSubmit: async () => {
      try {
        const uploadedImageUrl = await saveImage(); // ✅ Wait for image upload
    
        if (!uploadedImageUrl) {
          toast.error("Image not uploaded successfully. Please try again.");
          return;
        }
    
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-US");
        const formattedTime = currentDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        });
    
        const newPet = {
          image: uploadedImageUrl, // ✅ Use the returned image URL
          name: values.name,
          age: values.age,
          location: values.location,
          category: category.value, // ✅ Fix category selection
          shortdesp: values.shortdesp,
          longdesp: values.longdesp,
          addedDate: `${formattedDate} ${formattedTime}`,
          adopted: false,
          userEmail: user.email,
        };
    
        console.log("New Pet Data:", newPet);
    
        const response = await fetch("http://localhost:5007/pets", { 
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(newPet),
        });
        
        
        const data = await response.json();
        console.log("DB Response:", data); // ✅ Debugging Response
        
    
        if (data.insertedId) {
          Swal.fire({
            title: "Success!",
            text: "Pet Added Successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error adding pet:", error);
      }
    },
  });
  



  
    return (
      <div className="flex items-center justify-center py-12 px-4 w-full lg:w-10/12 mx-auto bg-base-300 mt-16 rounded-2xl">
      <div className="w-full max-w-[600px] bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Add a Pet for Adoption</h2>
    
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Image */}
          <div>
            <label className="block mb-2 text-base font-medium text-gray-700">Upload Image</label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png"
                    alt="Default"
                    className="w-8 opacity-70"
                  />
                )}
              </div>
    
              <label
                htmlFor="file-upload"
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 text-sm"
              >
                Choose Image
              </label>
    
              <input
                id="file-upload"
                type="file"
                name="photo"
                className="hidden"
                onBlur={handleBlur}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            {errors.photo && touched.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
          </div>
    
          {/* Pet Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-base font-medium text-gray-700">Pet Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-gray-300 py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && touched.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
    
          {/* Pet Location */}
          <div>
            <label htmlFor="location" className="block mb-2 text-base font-medium text-gray-700">Pet Location</label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-gray-300 py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.location && touched.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
    
          {/* Pet Category */}
          <div>
            <label htmlFor="pet_category" className="block mb-2 text-base font-medium text-gray-700">Pet Category</label>
            <Select
              name="pet_category"
              id="pet_category"
              value={category}
              options={categoryOptions}
              onChange={handleCategorySelectChange}
              className="text-sm"
            />
            {errors.category && touched.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
    
          {/* Pet Age */}
          <div>
            <label htmlFor="age" className="block mb-2 text-base font-medium text-gray-700">Pet Age</label>
            <input
              type="number"
              name="age"
              id="age"
              placeholder="Age in years"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-gray-300 py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.age && touched.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>
    
          {/* Short Description */}
          <div>
            <label htmlFor="shortdesp" className="block mb-2 text-base font-medium text-gray-700">Short Description</label>
            <input
              type="text"
              name="shortdesp"
              id="shortdesp"
              placeholder="E.g. Friendly and playful"
              value={values.shortdesp}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-gray-300 py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.shortdesp && touched.shortdesp && <p className="text-red-500 text-sm mt-1">{errors.shortdesp}</p>}
          </div>
    
          {/* Long Description */}
          <div>
            <label htmlFor="longdesp" className="block mb-2 text-base font-medium text-gray-700">Long Description</label>
            <textarea
              name="longdesp"
              id="longdesp"
              placeholder="Add a detailed description"
              value={values.longdesp}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="4"
              className="w-full rounded-md border border-gray-300 py-2 px-4 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.longdesp && touched.longdesp && <p className="text-red-500 text-sm mt-1">{errors.longdesp}</p>}
          </div>
    
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-red-600 text-white rounded-md text-base font-semibold hover:bg-red-500 transition duration-200"
            >
              Add Pet
            </button>
          </div>
        </form>
      </div>
    </div>
    
    );
};

export default AddPet;