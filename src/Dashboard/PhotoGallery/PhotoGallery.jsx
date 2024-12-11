import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import Swal from 'sweetalert2';  // Import SweetAlert2

function PhotoGallery() {
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);



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



  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setVideoFile(file);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this gallery?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Submit!',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      setLoading(true);
  
      try {
        // Upload image to Cloudinary
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        imageFormData.append('upload_preset', 'leaonBirthdayWebsite');
        const cloudinaryImageResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/leonschaefer/image/upload',
          imageFormData
        );
  
        const resImageUrl = cloudinaryImageResponse.data.secure_url;
        const imageUrl = resImageUrl.replace(/(\/v\d+\/)(.*?)(\.(jpg|jpeg|png|heic|gif|bmp|tiff|svg))/i, '$1$2.webp');
        console.log(imageUrl);
  
        let videoUrl = null;
  
        // Upload video to Cloudinary if videoFile is provided
        if (videoFile) {
          const videoFormData = new FormData();
          videoFormData.append('file', videoFile);
          videoFormData.append('upload_preset', 'leaonBirthdayWebsite');
          const cloudinaryVideoResponse = await axios.post(
            'https://api.cloudinary.com/v1_1/leonschaefer/video/upload',
            videoFormData
          );
  
          videoUrl = cloudinaryVideoResponse.data.secure_url;
          console.log(videoUrl);
        }
  
        // Prepare data for the backend
        const galleryData = {
          title,
          img: imageUrl,
          videoUrl : videoLink ,
          zoom : selectedValue,

        };
  
        // Include video URL if it exists
        if (videoUrl) {
          galleryData.url = videoUrl;
        }
  
        console.log(galleryData);
  
        // Post data to the backend
        const response = await axios.post(
          'https://birthday-gift-web.vercel.app/api/v1/gallery/create',
          galleryData
        );
  
        if (response.status === 200) {
          console.log('Banner created successfully');
  
          // Clear form after submission
          setTitle('');
          setImagePreview(null);
          setImageFile(null);
          setVideoPreview(null);
          setVideoFile(null);
          setVideoLink("")
  
          // Show success alert
          Swal.fire('Success', 'Gallery submitted successfully!', 'success');
        }
      } catch (error) {
        console.error('Error uploading media or posting data:', error);
        // Show error alert
        Swal.fire('Error', 'There was an issue uploading the media. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <section className="mt-10">
      <p className="d__des mb-3">Create Your Amazing Photo and Video Gallery</p>

      <div className='border p-5 md:p-10 '>
        <div className=" grid lg:grid-cols-2 items-center lg:justify-center gap-10">
          {/* Image Upload Box */}
          <div
            className={`relative p-10 h-56 w-full flex items-center justify-center ${imagePreview ? 'border-[1px] border-dotted' : 'border-[1px] border-dotted rounded-sm'
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
                <h3 className="text-lg font-semibold text-gray-700 text-center">Upload Gallery Photo</h3>
                <p className="text-sm text-gray-500">Click to upload</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*,.heic"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Video Upload Box */}
          <div
            className={`relative p-10 h-56 w-full flex items-center justify-center ${videoPreview ? 'border-[1px] border-dotted' : 'border-[1px] border-dotted rounded-sm'
              }`}
          >
            {videoPreview ? (
              <video
                src={videoPreview}
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover rounded-md p-1"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <CloudUploadIcon fontSize="large" className="text-gray-700 mb-2" />
                <h3 className="text-lg font-semibold text-gray-700 text-center">Upload Gallery Video</h3>
                <p className="text-sm text-gray-500">Click to upload</p>
              </div>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className='w-full mt-10 lg:mt-14'>
          {/* Form */}
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-5">

              <div className='grid grid-cols-2 gap-10'>
                <div>
                  <label htmlFor="videoLink" className="block d__des mb-2">
                    Video Link
                  </label>
                  <input
                    type="text"
                    id="videoLink"
                    placeholder="Enter title"
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    
                  />
                </div>
                <div>
                  <label htmlFor="zoomIn" className="block d__des mb-2">
                    Want to ZoomIN
                  </label>
                  <select
                    name="Want ZoomIN"
                    id="zoomIn"
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:none"
                    value={selectedValue.toString()} e
                    onChange={handleChange} 
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>


              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block d__des mb-2">
                  Gallery Title
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
      </div>
    </section>
  );
}

export default PhotoGallery;
