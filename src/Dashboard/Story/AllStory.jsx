import React, { useEffect, useState } from "react";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineClose } from "react-icons/ai";


function AllStory() {
  const [imageUrls, setImageUrls] = useState([]);
  const [stories, setStories] = useState([]); // State for stories
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [currentStory, setCurrentStory] = useState(null); // State for selected story
  const [updatedTitle, setUpdatedTitle] = useState(""); // State for updated title
  const [updatedDescription, setUpdatedDescription] = useState(""); // State for updated description

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(
          "https://birthday-gift-web.vercel.app/api/v1/storey"
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
        cloudName: 'leonschaefer',
        uploadPreset: 'leaonBirthdayWebsite',
        sources: ['local', 'camera', 'url'],
        cropping: false,
        multiple: true,
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
          console.log('Uploaded URL:', result.info.secure_url);

          const webpUrl = result.info.secure_url.replace(/(\/v\d+\/)(.*?)(\.(jpg|jpeg|png|heic|gif|bmp|tiff|svg))/i, '$1$2.webp');

          console.log('WebP URL:', webpUrl);
          setImageUrls((prev) => [...prev, webpUrl]);
        }
      }
    );
  };

  console.log(stories)
  // Delete story
  const deleteStory = async (id) => {
    console.log("id ", id)
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
            `https://birthday-gift-web.vercel.app/api/v1/storey/${id}`
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
    setIsModalOpen(true);
  };

  // Update story
  const updateStory = async () => {
    try {
      await axios.patch(
        `https://birthday-gift-web.vercel.app/api/v1/storey/${currentStory.id}`,
        { title: updatedTitle, des: updatedDescription , images:imageUrls }
      );
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === currentStory.id
            ? { ...story, title: updatedTitle, des: updatedDescription }
            : story
        )
      );
      setIsModalOpen(false);
      Swal.fire("Updated!", "Your story has been updated.", "success");
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  // handle open modal box and upload area
  const handleBox = (story) => {
    handleUpload()
    openModal(story)

  }

  const handleDeleteImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
};

  console.log(imageUrls)
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
                            <AiOutlineClose/>
                        </button>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
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
                <div className="grid lg:grid-cols-2 xl:grid-cols-3  gap-5">
                  {
                    story?.images.map((img, index) => (
                      <div key={index}>
                        <img
                          src={img}
                          alt="story images"
                          loading="lazy"
                          className="h-[30vh] object-cover"
                        >
                        </img>
                      </div>
                    ))
                  }


                </div>
                <div>
                  <div className="flex justify-between items-center mt-10 mb-2">
                    <h3 className="d__title">{story.title}</h3>
                    <div className="flex gap-5 items-center cursor-pointer">
                      <span
                        className="hover:text-green-600"
                        onClick={() => handleBox(story)}
                      >
                        <BorderColorIcon />
                      </span>
                      <span
                        className="hover:text-red-500"
                        onClick={() => deleteStory(story.id)}
                      >
                        <DeleteIcon />
                      </span>
                    </div>
                  </div>
                  <p className="d__des">{story.des}</p>
                </div>


              </div>
            ))
          ) : (
            <p>No stories available.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default AllStory;
