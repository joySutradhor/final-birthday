import React, { useEffect, useState } from "react";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import axios from "axios";
import Swal from "sweetalert2";

function AllStory() {
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
          "https://birthday-gift-server.vercel.app/api/v1/storey"
        );
        setStories(response.data.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  // Delete story
  const deleteStory = async (id) => {
    console.log("id " , id)
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
            `https://birthday-gift-server.vercel.app/api/v1/storey/${id}`
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
        `https://birthday-gift-server.vercel.app/api/v1/storey/${currentStory.id}`,
        { title: updatedTitle, des: updatedDescription }
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

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-80 bg-white flex items-center justify-center z-50 w-full">
          <div className="bg-white rounded-md shadow-md p-5 w-1/2 ">
            <h3 className="d__subHeading py-4">Update Story</h3>
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
                <div className="flex justify-between gap-10">
                  <h3 className="d__title">{story.title}</h3>
                  <div className="flex gap-5 items-center cursor-pointer">
                    <span
                      className="hover:text-green-600"
                      onClick={() => openModal(story)}
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
