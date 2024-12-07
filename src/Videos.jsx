import React, { useEffect, useState } from 'react'

function Videos() {
    const [videos, setVideos] = useState([]);

    // Fetch slide data
    useEffect(() => {
        fetch('https://birthday-gift-web.vercel.app/api/v1/video')
            .then((response) => response.json())
            .then((data) => setVideos(data.data))
            .catch((error) => console.error('Error fetching story:', error));
    }, []);
    return (
        <section className='sectionSpace pb-16 lg:pb-32' id='videos'>
            <h2 className='heading'>Our events</h2>
            <p className='para pt-5 lg:w-1/3 pb-10'>Our events celebrate love and creativity, offering unforgettable experiences that inspire connection and joy in every moment</p>

            {/* Videos link here */}
            <div className=' '>
                {videos && videos.length > 0 ? (
                    videos.map((video, index) => (
                        <div key={index}>
                            <iframe
                                className='w-full h-[50vh] xl:h-[80vh] mb-10'
                                src={video?.url.replace("watch?v=", "embed/")}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={video.title}
                            ></iframe>
                        </div>
                    ))
                ) : (
                    <p className='text-center text-gray-500'>No videos available</p>
                )}
            </div>


        </section>
    )
}

export default Videos