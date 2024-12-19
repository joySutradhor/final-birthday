import axios from 'axios';
import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";

function CreateBanner() {
  const [imageUrls, setImageUrls] = useState("");
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [loading, setLoading] = useState(false);


  const handleUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'leonschaefer',
        uploadPreset: 'leaonBirthdayWebsite',
        sources: ['local', 'camera', 'url'],
        cropping: false,
        multiple: false,
        resourceType: 'image',
        clientAllowedFormats: ['webp', 'jpg', 'png', 'heic'],
        transformation: [
          {
            fetch_format: 'auto',
            quality: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Upload Error:', error);
          return;
        }

        if (result.event === 'success') {

          const webpUrl = result.info.secure_url.replace(/(\/v\d+\/)(.*?)(\.(jpg|jpeg|png|heic|gif|bmp|tiff|svg))/i, '$1$2.webp');
          setImageUrls(webpUrl)

        }
      }
    );
  };

  const handleDeleteImage = (index) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bannerData = {
        title,
        des: shortDescription,
        img: imageUrls,
      };

      // Post data to your API
      const response = await axios.post(
        'https://leon-final-server-iwnx.vercel.app/api/v1/slider/create',
        bannerData
      );

      if (response.status === 200) {
        setTitle('');
        setShortDescription('');
        setImageUrls("");
      }
    } catch (error) {
      console.error('Error submitting Banner:', error);
      alert('Error: ' + error.message); 
    } finally {
      setLoading(false);
    }
  };


  // handle text area 
  const handleInputChange = (e) => {
    setShortDescription(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <section className="mt-10">
      <p className="d__des mb-3">Create Your Amazing Banner here</p>
      <div className="border p-5 lg:p-10 space-y-5 grid lg:grid-cols-2 gap-10">
        {/* Image Upload Box */}
        <div className="relative min-h-56 w-full flex items-center justify-center border-[1px] border-dotted rounded-sm">
          {imageUrls? (
            <div>
              <div className="relative">
                <img
                  src={imageUrls}
                  alt={`Uploaded Image`}
                  loading="lazy"
                  className="w-full h-52 object-cover rounded-md p-1"
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <span><IoCloseSharp /></span>
                </button>
              </div>


            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="bg-gray-700 text-white py-2 px-4 rounded"
            >
              Upload Images
            </button>
          )}
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
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-sm mt-6"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateBanner;
