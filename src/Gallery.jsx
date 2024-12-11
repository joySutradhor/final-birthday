import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import { Fade, Zoom } from 'react-awesome-reveal';
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



    return (
        <section className="sectionSpace" id="gallery">
            <h2 className="heading">{galleryTitle}</h2>
            <p className="para pt-5 xl:w-1/3 pb-10">
                {galleryDes}
            </p>

            {/* Gallery images */}
            {/* Gallery images */}
            <div>
                <Box sx={{ width: '85vw', overflow: 'clip' }}>
                    <ImageList variant="masonry" cols={3} gap={8}>
                        {images?.map((item) => (
                            <ImageListItem key={item.id} onClick={() => openMedia(item)}>
                                <div className="image-container relative w-full h-auto overflow-x-hidden overflow-y-hidden cursor-pointer group ">
                                    {/* Random Animation for Image */}
                                    {(() => {
                                        const animation = getRandomAnimation();
                                        const hoverScaleClass =
                                            item?.zoom == "true"
                                                ? "group-hover:scale-125 grayscale group-hover:grayscale-0 transition-transform ease-in-out duration-1000"
                                                : "";

                                        if (animation === "zoom") {
                                            return (
                                                <Zoom>
                                                    <img
                                                        srcSet={`${item?.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                        src={`${item?.img}?w=248&fit=crop&auto=format`}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        className={`w-full h-auto  object-cover ${hoverScaleClass}  `}
                                                    />
                                                </Zoom>
                                            );
                                        } else if (animation === "fadeLeft") {
                                            return (
                                                <Fade direction="left">
                                                    <img
                                                        srcSet={`${item?.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                        src={`${item?.img}?w=248&fit=crop&auto=format`}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        className={`w-full h-auto object-cover ${hoverScaleClass} `}
                                                    />
                                                </Fade>
                                            );
                                        } else if (animation === "fadeRight") {
                                            return (
                                                <Fade direction="right">
                                                    <img
                                                        srcSet={`${item?.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                        src={`${item?.img}?w=248&fit=crop&auto=format`}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        className={`w-full h-auto object-cover ${hoverScaleClass} `}
                                                    />
                                                </Fade>
                                            );
                                        } else {
                                            return (
                                                <Fade direction="left">
                                                    <img
                                                        srcSet={`${item?.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                        src={`${item?.img}?w=248&fit=crop&auto=format`}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        className={`w-full h-auto object-cover ${hoverScaleClass} `}
                                                    />
                                                </Fade>
                                            );
                                        }
                                    })()}

                                    {/* Title */}
                                    <div className='absolute z-50 inset-0 flex justify-center items-center group-hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out'>
                                        <h3 className="text-white text-xl font-bold font-custom">{item.title}</h3>
                                    </div>
                                </div>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </div>;


            {openModal && (
                <div
                    className="fixed inset-0 bg-black  flex justify-center items-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="rounded-lg p-4 relative max-w-3xl w-full flex justify-center items-center "
                        onClick={(e) => e.stopPropagation()}
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
