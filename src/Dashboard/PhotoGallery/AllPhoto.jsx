import React, { useEffect, useState } from "react";
import CollectionsIcon from "@mui/icons-material/Collections";
import axios from "axios";
import Swal from "sweetalert2";

export default function AllPhoto() {
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [newVideo, setNewVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch slide data
    useEffect(() => {
        axios
            .get("https://birthday-gift-express.vercel.app/api/v1/gallery")
            .then((response) => setImages(response.data.data))
            .catch((error) => console.error("Error fetching slides:", error));
    }, []);

    // Cloudinary upload function for both images and videos
    const uploadToCloudinary = async (file, type = "image") => {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/joysutradhor/${type}/upload`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "shahinvai");

        try {
            const response = await axios.post(cloudinaryUrl, formData);
            return response.data.secure_url; // Get the uploaded URL
        } catch (error) {
            throw error;
        }
    };

    // Edit button handler
    const handleEdit = (id) => {
        const image = images.find((img) => img.id === id);
        setSelectedImage(image);
        setUpdatedTitle(image.title);
        setNewImage(image.img);
        setNewVideo(image.url);
        setShowModal(true);
    };

    // Delete button handler with permission prompt
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "No, cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBanner(id);
                setLoading(true);
            }
        });
    };

    const deleteBanner = async (id) => {
        try {
            await axios.delete(`https://birthday-gift-express.vercel.app/api/v1/gallery/${id}`);
            setImages((prevImages) => prevImages.filter((img) => img.id !== id));
            Swal.fire("Deleted!", "Your banner has been deleted.", "success");
            setLoading(false);
        } catch (error) {
            Swal.fire("Error!", "Unable to delete the banner.", "error");
        }
    };

    // Image change handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setNewImage(fileUrl);
        }
    };

    // Video change handler
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setNewVideo(fileUrl);
        }
    };

    // Submit form handler with permission prompt
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: "Confirm Update",
            text: "Are you sure you want to update this banner?",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                updateBanner();
                setLoading(true);
                
            }
        });
    };

    const updateBanner = async () => {
        try {
            let imageUrl = selectedImage.img; 
            let videoUrl = selectedImage.url; 
    
            if (newImage && newImage !== selectedImage.img) {
                console.log("Uploading new image...");
                const file = document.getElementById("image").files[0];
                imageUrl = await uploadToCloudinary(file, "image");
                console.log("Image uploaded:", imageUrl);
            }
    
            if (newVideo && newVideo !== selectedImage.url) {
                console.log("Uploading new video...");
                const file = document.getElementById("video").files[0];
                videoUrl = await uploadToCloudinary(file, "video");
                console.log("Video uploaded:", videoUrl);
            }
    
            console.log("Sending data to API:", { title: updatedTitle, img: imageUrl, url: videoUrl });
            const response = await axios.patch(
                `https://birthday-gift-express.vercel.app/api/v1/gallery/${selectedImage.id}`,
                {
                    title: updatedTitle,
                    img: imageUrl,
                    url: videoUrl,
                }
            );
    
            console.log("API Response:", response.data);
    
            if (response.status === 200) {
                setImages((prevImages) =>
                    prevImages.map((img) =>
                        img.id === selectedImage.id
                            ? { ...img, title: updatedTitle, img: imageUrl, video: videoUrl }
                            : img
                    )
                );
                setShowModal(false);
                setLoading(false);
                Swal.fire("Updated!", "Your Gallery has been updated.", "success");
            }
        } catch (error) {
            console.error("Error updating gallery:", error);
            Swal.fire("Error!", "Unable to update the gallery.", "error");
        }
    };
    

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <section className="py-10 md:py-20">
            <h2 className="flex gap-1 items-center d__subHeading">
                <span>
                    <CollectionsIcon />
                </span>{" "}
                List of Photo Gallery
            </h2>

            <div>
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-10 mt-10">
                    {images?.map((img) => (
                        <div
                            key={img.id}
                            className="border grid grid-cols-1 rounded-lg hover:shadow-sm group relative"
                        >
                            <div className="relative">
                                <img
                                    className="h-64 w-full object-cover"
                                    src={img?.img}
                                    alt={img?.title}
                                />
                                <div className="absolute top-4 right-4 space-x-4 group">
                                    <button
                                        onClick={() => handleEdit(img.id)}
                                        className="bg-green-600 text-white px-4 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h2 className="d__title">{img?.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md w-[95%] md:w-[60%] lg:w-[45%] xl:w-1/3">
                        <h3 className="d__subHeading mb-4">Edit Photo Gallery</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="image"
                                    className="block d__des mb-2"
                                >
                                    Select New Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border rounded-sm focus:outline-none"
                                    disabled={loading}
                                />
                            </div>
                            {newImage && (
                                <div className="mb-4 md:mb-10">
                                    <img
                                        src={newImage}
                                        alt="New Preview"
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label
                                    htmlFor="video"
                                    className="block d__des mb-2"
                                >
                                    Select New Video
                                </label>
                                <input
                                    type="file"
                                    id="video"
                                    onChange={handleVideoChange}
                                    className="w-full px-4 py-2 border rounded-sm focus:outline-none"
                                    disabled={loading}
                                />
                            </div>
                            {newVideo && (
                                <div className="mb-4">
                                    <video
                                        src={newVideo}
                                        autoPlay
                                        muted
                                        loop
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label
                                    htmlFor="title"
                                    className="block d__des mb-2"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={updatedTitle}
                                    onChange={(e) => setUpdatedTitle(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-sm focus:outline-none"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex justify-between mt-5 md:mt-10">
                                <button
                                    type="submit"
                                    className="bg-green-700 text-white px-6 py-2 rounded-sm"
                                    disabled={loading}
                                >
                                   {loading ? "Uploading..." : "Update"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="bg-gray-400 text-white px-6 py-2 rounded-sm"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
