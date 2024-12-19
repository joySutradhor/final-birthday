import React, { useEffect, useState } from "react";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineClose } from "react-icons/ai";

function AllStory() {
  const [imageUrls, setImageUrls] = useState([]);
  const [stories, setStories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedMusic, setUpdatedMusic] = useState("");

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(
          "https://leon-final-server-iwnx.vercel.app/api/v1/storey"
        );
        setStories(response.data.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);




  const handleUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: "leonschaefer",
        uploadPreset: "leaonBirthdayWebsite",
        sources: ["local", "camera", "url"],
        cropping: false,
        multiple: true,
        resourceType: "image",
        clientAllowedFormats: ["webp", "jpg", "png", "heic"],
        transformation: [
          {
            fetch_format: "auto",
            quality: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          console.error("Upload Error:", error);
          return;
        }

        if (result.event === "success") {
          // Convert the uploaded image URL to WebP format
          const webpUrl = result.info.secure_url.replace(
            /(\/v\d+\/)(.*?)(\.(jpg|jpeg|png|heic|gif|bmp|tiff|svg))/i,
            "$1$2.webp"
          );

          // Update state only if upload is successful
          setImageUrls((prev) => [...prev, webpUrl]);
        }
      }
    );
  };

  // Delete story
  const deleteStory = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This story will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://leon-final-server-iwnx.vercel.app/api/v1/storey/${id}`
          );
          setStories((prevStories) =>
            prevStories.filter((story) => story.id !== id)
          );
          Swal.fire("Deleted!", "Your story has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting story:", error);
        }
      }
    });
  };

  // Open update modal
  const openModal = (story) => {
    setCurrentStory(story);
    setUpdatedTitle(story.title);
    setUpdatedDescription(story.des);
    setUpdatedMusic(story.musicUrl);

    // Set imageUrls to the existing images from the database (if any)
    setImageUrls(story.images || []);
    setIsModalOpen(true);
  };

  // music url
  const handleMusicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUpdatedMusic(file);

    // Prepare the file for upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "leaonBirthdayWebsite");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/leonschaefer/raw/upload",
        formData
      );

      // Extract the uploaded file's URL from the response
      const uploadedMusicUrl = response.data.secure_url;
      setUpdatedMusic(uploadedMusicUrl); 
    } catch (error) {
      console.error("Error uploading music to Cloudinary:", error);
      alert("Failed to upload music. Please try again.");
    }
  };




  // Update story
  const updateStory = async () => {
    try {
      // Check if imageUrls is empty and update accordingly
      const imagesToUpdate = imageUrls.length > 0 ? imageUrls : currentStory.images;

      await axios.patch(
        `https://leon-final-server-iwnx.vercel.app/api/v1/storey/${currentStory.id}`,
        {
          title: updatedTitle,
          des: updatedDescription,
          images: imagesToUpdate, // Use the existing images if no new images are uploaded
          musicUrl: updatedMusic,
        }
      );

      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === currentStory.id
            ? { ...story, title: updatedTitle, des: updatedDescription, musicUrl: updatedMusic, images: imagesToUpdate }
            : story
        )
      );

      setIsModalOpen(false);
      Swal.fire("Updated!", "Your story has been updated.", "success");
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  const handleBox = (story) => {
    handleUpload();
    openModal(story);
  };

  const handleDeleteImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-80 bg-white flex items-center justify-center z-50 w-full">
          <div className="bg-white rounded-md shadow-md p-5 w-[95%] md:w-[60%] lg:w-[45%] xl:w-1/2 my-16 lg:my-0 border">
            <h3 className="d__subHeading py-4">Update Story</h3>

            {/* Preview images with delete button */}
            <div className="grid lg:grid-cols-3 grid-cols-2 mb-10 gap-5">
              {imageUrls?.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    className="lg:h-48 h-36 object-cover rounded-md"
                    alt={`Uploaded ${index}`}
                  />
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs shadow-md"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="music-upload">
                {/* Audio Preview */}
                <div className="mb-4">
                  <p className="mb-2">Existing Music Preview:</p>
                  <audio controls src={updatedMusic} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {/* File Input */}
                <div>
                  <label className="block mb-2 d__des">Upload New Music</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicUpload}
                    className="w-full p-2 d__des border rounded outline-none"
                  />
                </div>
              </div>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-2 d__des border rounded outline-none"
              />
              <textarea
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 d__des border rounded outline-none"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateStory}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stories Section */}
      <section className="my-20 p-5 md:p-10 border">
        <h2 className="d__title mb-8 flex items-center gap-1">
          <SpeakerNotesIcon />
          Show Your Feelings Here
        </h2>
        <div className="space-y-5">
          {stories.length > 0 ? (
            stories.map((story) => (
              <div key={story.id} className="border p-5 space-y-4">
                <div className=" space-y-10 lg:space-y-14">

                  <div className="flex  justify-between items-center">
                    <div>
                      <audio controls src={story?.musicUrl} >
                        Your browser does not support the audio element.
                      </audio>
                    </div>

                    <div className="flex gap-10 items-center ">
                      <button
                        onClick={() => handleBox(story)}
                        className="text-blue-600"
                      >
                        <BorderColorIcon /> Edit
                      </button>
                      <button
                        onClick={() => deleteStory(story.id)}
                        className="text-red-600"
                      >
                        <DeleteIcon /> Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {story.images?.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt="Story"
                          className="h-36 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <h4 className="text-lg font-bold">{story.title}</h4>
                <p>{story.des}</p>

              </div>
            ))
          ) : (
            <p>No stories found</p>
          )}
        </div>
      </section>
    </>
  );
}

export default AllStory;
