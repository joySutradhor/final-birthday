import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

function VideoAlbum() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState([]);

    // Fetch all videos
    const fetchVideos = async () => {
        try {
            const response = await axios.get('https://birthday-gift-express.vercel.app/api/v1/video');
            setVideos(response?.data?.data);

        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    // Delete a video by ID
    const deleteVideo = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this video!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://birthday-gift-express.vercel.app/api/v1/video/${id}`);
                    Swal.fire('Deleted!', 'The video has been deleted.', 'success');
                    // Refresh the video list after deletion
                    fetchVideos();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to delete the video.', 'error');
                }
            }
        });
    };

    // Submit a new video
    const onSubmit = async (data) => {
        const videoData = { url: data.url };

        if (loading) return;

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to upload this YouTube link?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, upload it!',
            cancelButtonText: 'No, cancel!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);

                const loadingSwal = Swal.fire({
                    title: 'Uploading...',
                    text: 'Please wait while we upload your link.',
                    icon: 'info',
                    showConfirmButton: false,
                    didOpen: () => Swal.showLoading()
                });

                try {
                    await axios.post('https://birthday-gift-express.vercel.app/api/v1/video/create', videoData);

                    loadingSwal.close();
                    Swal.fire('Success!', 'Your video link has been uploaded successfully.', 'success');

                    reset();
                    fetchVideos(); // Refresh the video list after upload
                } catch (error) {
                    loadingSwal.close();
                    Swal.fire('Error!', 'There was an error uploading your video link.', 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Load videos on component mount
    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <>
            <section className="mt-10 border p-5 md:p-10">
                <h2 className="d__subHeading mb-8">Upload Your YouTube  Link</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label htmlFor="url" className="block d__des mb-2">
                            YouTube Embed Link
                        </label>
                        <input
                            type="text"
                            id="url"
                            {...register('url', {
                                required: 'YouTube Link is required',
                            })}
                            className="border p-2 w-full outline-none"
                        />
                        {errors.url && (
                            <p className="text-red-500">{errors.url.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-gray-700 text-white p-2 px-8 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Submit'}
                    </button>
                </form>
            </section>

            {/* Display all videos */}
            <div className="py-10 lg:py-20">
                <h3 className="d__subHeading mb-4">Uploaded Videos</h3>
                {videos?.length === 0 ? (
                    <p>No videos found.</p>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-5">
                        {videos?.map((video) => (
                            <div key={video._id} className="relative">
                                <iframe
                                    className="lg:w-[28vw] lg:h-[40vh] w-full h-[30vh]"
                                    src={video.url.replace("watch?v=", "embed/")}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={video.title}
                                ></iframe>
                                <button
                                    onClick={() => deleteVideo(video._id)}
                                    className=" bg-red-600 text-white p-2 px-8 my-4 rounded "
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default VideoAlbum;
