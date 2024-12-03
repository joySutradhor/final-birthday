import React, { useEffect, useState } from 'react'

export default function Story() {
    const [story, setStory] = useState([]);

    // Fetch slide data
    useEffect(() => {
        fetch('https://birthday-gift-website.vercel.app/api/v1/storey')
            .then((response) => response.json())
            .then((data) => setStory(data.data))
            .catch((error) => console.error('Error fetching story:', error));
    }, []);

    return (
        <section className='sectionSpace' id='story'>
            <h2 className='heading'>Our Memories</h2>
            <p className='para pt-5 xl:w-1/3 pb-10'>A collection of moments that define us, capturing the essence of love, laughter, and unforgettable experiences together.</p>

            {/* story here  */}
            <div className='space-y-10'>
                {story && story.length > 0 ? (
                    story.map((item, index) => (
                        <div key={index} className='p-5 border border-white/10 space-y-4'>
                            <h2 className='heading'>{item?.title}</h2>
                            <p className='para' style={{
                                whiteSpace: "pre-wrap", 
                                padding: "10px",
                                
                            }}>{item?.des}</p>
                        </div>
                    ))
                ) : (
                    <p className='text-center font-custom text-gray-500'>No story available</p>
                )}
            </div>

        </section>
    )
}
