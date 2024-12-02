import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

function UploadMusic() {
  const [musicPreview, setMusicPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMusicFile(file);
      const url = URL.createObjectURL(file);
      setMusicPreview(url); // Create a temporary preview URL
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append('file', musicFile);
    formData.append('upload_preset', 'shahinvai'); // Replace with your preset

    try {
      // Upload to Cloudinary or any backend
      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/joysutradhor/raw/upload', // Replace with your endpoint
        formData
      );

      const musicUrl = cloudinaryResponse.data.secure_url;

      // Prepare data for your backend
      const musicData = {
        title,
        artist,
        fileUrl: musicUrl,
      };

      // Post to your backend API
      const response = await axios.post('https://birthday-gift-express.vercel.app/api/v1/music/create', musicData);

      if (response.status === 200) {
        console.log('Music uploaded successfully!');
        setTitle('');
        setArtist('');
        setMusicPreview(null);
        setMusicFile(null);
      }
    } catch (error) {
      console.error('Error uploading music:', error);
      alert('Failed to upload music.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10">
      <p className="d__des mb-3">Upload Your Music</p>
      <div className="border  p-5 md:p-10 gap-10 lg:w-[50%]">
        {/* Music Upload Box */}
        <div
          className={`relative p-10 h-56 w-full flex items-center justify-center ${
            musicPreview ? 'border-[1px] border-dotted' : 'border-[1px] border-dotted rounded-sm'
          }`}
        >
          {musicPreview ? (
            <audio controls className="absolute inset-0 w-full h-full p-1">
              <source src={musicPreview} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <CloudUploadIcon fontSize="large" className="text-gray-700 mb-2" />
              <h3 className="text-lg font-semibold text-gray-700">Upload Your Music</h3>
              <p className="text-sm text-gray-500">Click to upload</p>
            </div>
          )}
          <input
            type="file"
            accept="audio/*"
            onChange={handleMusicUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit}>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-sm mt-6"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default UploadMusic;
