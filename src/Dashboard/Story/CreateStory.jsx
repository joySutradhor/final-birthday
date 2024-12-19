import axios from 'axios';
import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";

function CreateStory() {
    const [imageUrls, setImageUrls] = useState([]);
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [music, setMusic] = useState("");
    const [musicPreview, setMusicPreview] = useState(null);


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

                    const webpUrl = result.info.secure_url.replace(/(\/v\d+\/)(.*?)(\.(jpg|jpeg|png|heic|gif|bmp|tiff|svg))/i, '$1$2.webp');

                    setImageUrls((prev) => [...prev, webpUrl]);
                }
            }
        );
    };


    // for music
     const handleMusicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "leaonBirthdayWebsite");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/leonschaefer/raw/upload",
                formData
            );
            setMusic(response.data.secure_url); 
            setMusicPreview(URL.createObjectURL(file)); 
        } catch (error) {

            alert("Failed to upload music. Please try again.");
        } finally {
            setLoading(false);
        }
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
                images: imageUrls,
                musicUrl : music
            };



            // Post data to your API
            const response = await axios.post(
                'https://leon-final-server-iwnx.vercel.app/api/v1/storey/create',
                bannerData
            );

            if (response.status === 200) {
                setTitle('');
                setShortDescription('');
                setImageUrls([]);
                setMusic("")
            }
        } catch (error) {
            console.error('Error submitting story:', error);
            alert('Error: ' + error.message); // Alert on error
        } finally {
            setLoading(false);
        }
    };


    // handle text area 
    const handleInputChange = (e) => {
        setShortDescription(e.target.value);

        // Auto-expand the textarea height based on its scrollHeight
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

  

    return (
        <section className="mt-10">
            <p className="d__des mb-3">Create Your Amazing Story</p>
            <div className="border p-5 lg:p-10 space-y-5">
                {/* Image Upload Box */}
                <div className="relative min-h-56 w-full flex items-center justify-center border-[1px] border-dotted rounded-sm">
                    {imageUrls.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-5 gap-4 items-center">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={url}
                                            alt={`Uploaded Image ${index}`}
                                            loading="lazy"
                                            className="w-full h-28 object-cover rounded-md p-1"
                                        />
                                        <button
                                            onClick={() => handleDeleteImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <span><IoCloseSharp /></span>
                                        </button>
                                    </div>
                                ))}
                                <div>
                                    <button
                                        onClick={handleUpload}
                                        className="bg-gray-700 text-white py-2 px-4 rounded"
                                    >
                                        Upload More
                                    </button>
                                </div>
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

                        <div>
                            <label htmlFor="music" className="block d__des mb-2">
                                Music (Upload Audio File)
                            </label>
                            <input
                                type="file"
                                id="music"
                                accept="audio/*"
                                onChange={handleMusicUpload}
                                className="w-full px-4 py-2 border rounded-sm focus:outline-none"
                            />
                        </div>
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

export default CreateStory;
