import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../../../components/providers/AuthProvider";
// import { useRef } from "react";

const UpdatePet = () => {
  const { user } = useContext(AuthContext);
  const pet=useLoaderData()
  const [updateImage, setUpdateImage] = useState('');
  console.log('update image dekhbo',updateImage);
  const [url, setUrl] = useState('');

  const navigate = useNavigate();
  const { petId } = useParams();
  const {_id,name,shortdesp,longdesp,age,location,image,category}=pet;
  const [updateCategory, setUpdateCategory] = useState(category);
  const [photourl,setPhotourl]=useState('link')
  const categoryOptions = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Bird", label: "Bird" },
    { value: "Rabbit", label: "Rabbit" },
  ];

  const [initialValues, setInitialValues] = useState({
    name: name,
    age: age,
    category: "",
    location: location,
    shortdesp: shortdesp,
    longdesp: longdesp,
    photo: image,
  });
console.log('name updated',name);
  useEffect(() => {
    if (!petId) {
      // Handle the case where petId is undefined
      console.error('Pet ID is undefined');
      return;
    }
  
    const fetchPetData = async () => {
      try {
        const response = await fetch(`http://localhost:5007/pets/${petId}`);
        const data = await response.json();
  
        setInitialValues({
          name: data.name,
          age: data.age,
          category: { value: data.category, label: data.category },
          location: data.location,
          shortdesp: data.shortdesp,
          longdesp: data.longdesp,
          photo: data.image,  // Make sure this is correct
        });
  
        setUrl(data.image);
        setUpdateCategory({ value: data.category, label: data.category });
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };
  
    fetchPetData();
  }, [petId]);
  

  const saveImage = async () => {
    try {
      if (!updateImage) {
        return toast.error("Please upload an image");
      }

      const formData = new FormData();
      formData.append("image", updateImage);

      const response = await axios.post("https://api.imgbb.com/1/upload?key=055a245dd93198ad79e84b535cd64548", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
console.log('x',response.data);
      if (response.data.status === 200) {
        setUrl(response.data.data.display_url);
        console.log('matha kharap',response.data.data.url);
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  

  const handleCategorySelectChange = (selectedOption) => {
    setUpdateCategory(selectedOption);
    setFieldValue("category", selectedOption);
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    onSubmit: async () => {
      try {
        await saveImage();
        if (!url) {
          return toast.error("Image not uploaded successfully. Please try again.");
        }

        const updatedPet = {
          image: url || 'photo',
          name: values.name,
          age: values.age,
          location: values.location,
          category: values.category.value,
          shortdesp: values.shortdesp,
          longdesp: values.longdesp,
          userEmail: user.email,
        };
        console.log('upadated pet....',updatedPet);
        // const fileInputRef = useRef(null); // Create a ref

        // const handleUpdateImage = (file) => {
        //   setFieldValue("photo", file);
        //   fileInputRef.current.value = '';
        // };
        const response = await fetch(`http://localhost:5007/pets/${petId}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updatedPet),
        });

        const data = await response.json();
        console.log(data);

        if (data.modifiedCount > 0) {
          Swal.fire({
            title: 'Success!',
            text: 'Pet Info Updated Successfully',
            icon: 'success',
            confirmButtonText: 'Cool',
          });
          // navigate('/');
        }
      } catch (error) {
        console.error("Error updating pet:", error);
      }
    },
  });
      console.log('image dekhbo',image);    
        

  return (
<div className="flex items-center justify-center p-12 w-full lg:w-10/12 mx-auto bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 mt-16 rounded-3xl">
  <div className="mx-auto w-full max-w-[550px] shadow-xl p-8 rounded-xl bg-white">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <div className="w-full">
          <label className="mb-3 block text-lg font-medium text-[#07074D]">Upload Image</label>
          <div className="flex justify-center items-center mb-5">
            <label htmlFor="file-upload" className="cursor-pointer hover:opacity-80 transition-all ease-in-out">
              {updateImage ? (
                <img className="w-16 h-16 object-cover rounded-full border-2 border-gray-300" src={URL.createObjectURL(updateImage)} alt="preview" />
              ) : (
                <img className="w-16 h-16 object-cover rounded-full border-2 border-gray-300" src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png" alt="default" />
              )}
            </label>
            <input
              id="file-upload"
              className="text-white file-input hidden"
              type="file"
              name="photo"
              onBlur={handleBlur}
              onChange={(e) => setUpdateImage(e.target.files[0])}
            />
          </div>
          {errors.photo && touched.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="name" className="mb-3 block text-lg font-medium text-[#07074D]">Add the Pet Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter Pet's Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-4 px-6 text-base font-medium text-[#6B7280] outline-none focus:ring-2 focus:ring-pink-300 transition-all ease-in-out"
        />
        {errors.name && touched.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="location" className="mb-3 block text-lg font-medium text-[#07074D]">Add the Pet Location</label>
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Enter Location"
          value={values.location}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-4 px-6 text-base font-medium text-[#6B7280] outline-none focus:ring-2 focus:ring-pink-300 transition-all ease-in-out"
        />
        {errors.location && touched.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="pet_category" className="mb-3 block text-lg font-medium text-[#07074D]">Pet Category</label>
        <Select
          name="pet_category"
          id="pet_category"
          value={updateCategory}
          required
          options={categoryOptions}
          onChange={handleCategorySelectChange}
          className="w-full rounded-md border border-[#e0e0e0] bg-white text-base font-medium text-[#6B7280] focus:ring-2 focus:ring-pink-300 transition-all ease-in-out"
        />
        {errors.category && touched.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>

      <div className="-mx-3 flex flex-wrap">
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label htmlFor="age" className="mb-3 block text-lg font-medium text-[#07074D]">Pet Age</label>
            <input
              type="number"
              name="age"
              id="age"
              placeholder="Enter Pet's Age"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-4 px-6 text-base font-medium text-[#6B7280] outline-none focus:ring-2 focus:ring-pink-300 transition-all ease-in-out"
            />
            {errors.age && touched.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="shortdesp" className="mb-3 block text-lg font-medium text-[#07074D]">Add Short Description</label>
        <input
          type="text"
          name="shortdesp"
          id="shortdesp"
          placeholder="Short Description"
          value={values.shortdesp}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-4 px-6 text-base font-medium text-[#6B7280] outline-none focus:ring-2 focus:ring-pink-300 transition-all ease-in-out"
        />
        {errors.shortdesp && touched.shortdesp && <p className="text-red-500 text-sm">{errors.shortdesp}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="longdesp" className="mb-3 block text-lg font-medium text-[#07074D]">Add Long Description</label>
        <textarea
          name="longdesp"
          id="longdesp"
          placeholder="Long Description"
          value={values.longdesp}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-4 px-6 text-base font-medium text-[#6B7280] outline-none focus:ring-2 focus:ring-pink-300 transition-all ease-in-out resize-none"
        />
        {errors.longdesp && touched.longdesp && <p className="text-red-500 text-sm">{errors.longdesp}</p>}
      </div>

      <div>
        <button
          type="submit"
          className="w-full py-4 px-8 text-center text-lg font-semibold text-white rounded-md bg-gradient-to-r from-pink-400 to-blue-500 hover:from-pink-500 hover:to-blue-600 transition-all ease-in-out"
        >
          Update Pet
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default UpdatePet;
