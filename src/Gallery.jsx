import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import { Fade, Zoom } from 'react-awesome-reveal'; // Import Zoom for zoom effect
import axios from 'axios';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);
    const [momentId, setMomentId] = useState(null);
    const [galleryTitle, setGalleryTitle] = useState("");
    const [galleryDes, setGalleryDes] = useState("");


    useEffect(() => {
        axios
            .get('https://birthday-gift-web.vercel.app/api/v1/title')
            .then((response) => {
                const fetchedMoment = response.data.data[0];
                setMomentId(fetchedMoment?._id); 
                setGalleryTitle(fetchedMoment?.title || '')
                setGalleryDes(fetchedMoment?.des || '')

            })
            .catch((error) => console.error('Error fetching moments:', error));
    }, []);


    // Fetch gallery data
    useEffect(() => {
        fetch('https://birthday-gift-web.vercel.app/api/v1/gallery')
            .then((response) => response.json())
            .then((data) => setImages(data.data))
            .catch((error) => console.error('Error fetching slides:', error));
    }, []);

    // Function to open the modal with the clicked image/video
    const openMedia = (media) => {
        setCurrentMedia(media);
        setOpenModal(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setOpenModal(false);
        setCurrentMedia(null);
    };

    // Function to get random animation
    const getRandomAnimation = () => {
        const animations = ['fade', 'zoom', 'fadeLeft', 'fadeRight'];
        const randomIndex = Math.floor(Math.random() * animations.length);
        return animations[randomIndex];
    };

    console.log(images)

    return (
        <section className="sectionSpace" id="gallery">
            <h2 className="heading">{galleryTitle}</h2>
            <p className="para pt-5 xl:w-1/3 pb-10">
                {galleryDes}
            </p>

            {/* Gallery images */}
            <div>
                <Box sx={{ width: '85vw', overflow: 'clip' }}>
                    <ImageList variant="masonry" cols={3} gap={8}>
                        {images?.map((item, index) => (
                            <ImageListItem key={item.id} onClick={() => openMedia(item)}>
                                <div className="image-container relative w-full h-auto group overflow-x-hidden overflow-y-hidden cursor-pointer">
                                    {/* Random Animation for Image */}
                                    {getRandomAnimation() === 'zoom' ? (
                                        <Zoom>
                                            <img
                                                srcSet={`${item?.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item?.img}?w=248&fit=crop&auto=format`}
                                                alt={item.title}
                                                loading="lazy"
                                                className="brightness-90"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    transition: 'opacity 0.3s',
                                                }}
                                            />
                                        </Zoom>
                                    ) : getRandomAnimation() === 'fadeLeft' ? (
                                        <Fade direction="left">
                                            <img
                                                srcSet={`${item?.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item?.img}?w=248&fit=crop&auto=format`}
                                                alt={item.title}
                                                loading="lazy"
                                                className="brightness-90"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    transition: 'opacity 0.3s',
                                                }}
                                            />
                                        </Fade>
                                    ) : getRandomAnimation() === 'fadeRight' ? (
                                        <Fade direction="right">
                                            <img
                                                srcSet={`${item?.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item?.img}?w=248&fit=crop&auto=format`}
                                                alt={item.title}
                                                loading="lazy"
                                                className="brightness-90"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    transition: 'opacity 0.3s',
                                                }}
                                            />
                                        </Fade>
                                    ) : (
                                        <Fade direction='left'>
                                            <img
                                                srcSet={`${item?.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item?.img}?w=248&fit=crop&auto=format`}
                                                alt={item.title}
                                                loading="lazy"
                                                className="brightness-90"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    transition: 'opacity 0.3s',
                                                }}
                                            />
                                        </Fade>
                                    )}

                                    {/* Video */}
                                    <video
                                        src={item.url}
                                        width="100%"
                                        height="100%"
                                        className='overflow-hidden'
                                        autoPlay
                                        loop
                                        muted
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                        }}
                                        loading="lazy"
                                    />

                                    {/* Title Overlay on Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <h3 className="text-white text-xl font-bold font-custom">{item.title}</h3>
                                    </div>


                                </div>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </div>

            {openModal &&  (
                <div
                    className="fixed inset-0 bg-black  flex justify-center items-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="rounded-lg p-4 relative max-w-3xl w-full flex justify-center items-center "
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the content
                    >
                        {currentMedia?.url ? (
                            <video
                                src={currentMedia?.url}
                                autoPlay
                                loop
                                muted

                                className="w-[80vw] lg:w-auto h-full object-contain"
                            />
                        ) : (
                            <img
                                src={currentMedia?.img}
                                alt={currentMedia?.title || "Media"}
                                className="w-[80vw] xl:w-auto h-full object-contain"
                            />
                        )}
                    </div>
                </div>
            )}


        </section>
    );
}
