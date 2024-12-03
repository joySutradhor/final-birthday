import React, { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import Swal from "sweetalert2";

function Music() {
  const [musicPreview, setMusicPreview] = useState(null);
  const [musicFile, setMusicFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [musicList, setMusicList] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all music files
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await axios.get(
          "https://birthday-gift-web.vercel.app/api/v1/music"
        );
        setMusicList(response?.data.data); // Assuming the API returns an array of music objects
      } catch (err) {
        setError("Failed to fetch music data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  // Delete a music file
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://birthday-gift-web.vercel.app/api/v1/music/${id}`
          );

          // Update state to remove deleted music
          setMusicList((prevMusicList) =>
            prevMusicList.filter((music) => music._id !== id)
          );

          Swal.fire("Deleted!", "Your music file has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Failed to delete music file.", "error");
          console.error(err);
        }
      }
    });
  };

  // Handle file input change
  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMusicFile(file);
      const url = URL.createObjectURL(file);
      setMusicPreview(url); // Create a temporary preview URL
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!musicFile) {
      Swal.fire("Error!", "Please select a music file to upload.", "error");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", musicFile);
    formData.append("upload_preset", "leaonBirthdayWebsite"); // Replace with your Cloudinary preset
    formData.append("resource_type", "raw"); // Ensures it's treated as a non-image resource

    try {
      // Upload to Cloudinary
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/leonschaefer/raw/upload", // Replace with your endpoint
        formData
      );

      const musicUrl = cloudinaryResponse.data.secure_url;

      // Prepare data for your backend
      const musicData = {
        musicUrl: musicUrl,
        title: musicFile.name, // Optional: Extract file name for title
      };

      // Post to your backend API
      const response = await axios.post(
        "https://birthday-gift-web.vercel.app/api/v1/music/create",
        musicData
      );

      if (response.status === 200) {
        Swal.fire("Success!", "Music uploaded successfully.", "success");

        // Refresh music list
        setMusicList((prevMusicList) => [...prevMusicList, musicData]);

        // Reset form
        setMusicPreview(null);
        setMusicFile(null);
      }
    } catch (error) {
      console.error("Error uploading music:", error);
      Swal.fire("Error!", "Failed to upload music.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10">
      <p className="d__des mb-3">Upload Your Music</p>
      <div className="border p-5 md:p-10 gap-10 lg:w-[50%]">
        {/* Music Upload Box */}
        <div
          className={`relative p-10 h-56 w-full flex items-center justify-center ${
            musicPreview
              ? "border-[1px] border-dotted"
              : "border-[1px] border-dotted rounded-sm"
          }`}
        >
          {musicPreview ? (
            <audio controls className="w-full">
              <source src={musicPreview} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <CloudUploadIcon fontSize="large" className="text-gray-700 mb-2" />
              <h3 className="text-lg font-semibold text-gray-700">
                Upload Your Music
              </h3>
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
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>

      {/* All Music */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Music Files</h2>
        {musicList.length === 0 ? (
          <p>No music files found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicList?.map((music) => (
              <div
                key={music._id}
                className="p-4 border rounded flex flex-col items-center"
              >
                <h3 className="font-semibold text-lg">{music.title}</h3>
                <audio controls className="w-full mt-2">
                  <source src={music.musicUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <button
                  onClick={() => handleDelete(music._id)}
                  className="mt-4 bg-red-500 text-white px-3 py-1 rounded text-left"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Music;
