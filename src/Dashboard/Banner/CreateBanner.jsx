import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios'; // Import Axios for HTTP requests

function CreateBanner() {
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file); 
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); 

    // 1. Upload the image to Cloudinary
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'leaonBirthdayWebsite'); 

    try {
      // Send the request to Cloudinary
      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/leonschaefer/image/upload', 
        formData
      );

      const imageUrl = cloudinaryResponse.data.secure_url; 

      const bannerData = {
        title,
        des: shortDescription,
        img: imageUrl, 
      };

      const response = await axios.post('https://birthday-gift-web.vercel.app/api/v1/slider/create', bannerData);

      if (response.status === 200) {
        console.log('Banner created successfully');
        
        // Clear form after submission
        setTitle('');
        setShortDescription('');
        setImagePreview(null);
        setImageFile(null);
      }
    } catch (error) {
      console.error('Error uploading image or posting data:', error);
      alert(error.message)
    } finally {
      setLoading(false); 
    }
  };

  return (
    <section className="mt-10">
      <p className="d__des mb-3">Create Your Amazing Banner Slider </p>
      <div className="border grid lg:grid-cols-2 items-center lg:justify-center p-5 md:p-10 gap-10">
        {/* Image Upload Box */}
        <div
          className={`relative p-10 h-56 w-full flex items-center justify-center ${
            imagePreview ? 'border-[1px] border-dotted' : 'border-[1px] border-dotted rounded-sm'
          }`}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-md p-1"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <CloudUploadIcon fontSize="large" className="text-gray-700 mb-2" />
              <h3 className="text-lg font-semibold text-gray-700">Upload Slider Banner</h3>
              <p className="text-sm text-gray-500">Click to upload</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-5">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block d__des mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter title"
                className="w-full px-4 py-2 border rounded-sm focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Short Description Field */}
            <div>
              <label htmlFor="short-description" className="block d__des mb-2">
                Short Description
              </label>
              <textarea
                id="short-description"
                placeholder="Enter short description"
                className="w-full px-4 py-2 border rounded-sm focus:outline-none resize-none"
                rows="4"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-sm mt-6"
            disabled={loading} 
          >
            {loading ? 'Submiting...' : 'Submit'} 
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateBanner;
