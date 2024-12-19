import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import StoryHeader from './StoryHeader';
import { Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Fade, Zoom } from 'react-awesome-reveal';

const SingleStory = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);
  const audioRef = useRef(null);

  // Fetch story data from the API based on the id
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`https://leon-final-server-iwnx.vercel.app/api/v1/storey/${id}`);
        const data = await response.json();
        setStory(data.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching story');
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);


  //  Function to open the modal with the clicked image/video
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

  const handleHover = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play();
    }
  };

  // Render the loading, error, or story data
  if (loading) {
    return <div>
      <p className='bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] h-screen flex justify-center items-center text-white/80 font-bold text-xl'>Loading ....</p>
    </div>;
  }

  if (error) {
    return <p>{error}</p>;
  }



  return (
    <div className='bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE]  min-h-screen group ' onMouseDownCapture={handleHover}>
      <div>
        <audio
          ref={audioRef}
          src={story?.musicUrl}
          loop
          autoPlay
          muted
        ></audio>
      </div>

      <StoryHeader />
      {story ? (
        <div className=' '>
          <div className=' mt-[20%] xl:mt-[2%] px-5 md:px-20   '>
            <div className='grid grid-cols-3 '>
              <div >
                <Box sx={{ width: '85vw', overflow: 'clip' }}>
                  <ImageList variant="masonry" cols={3} gap={8}>
                    {story?.images.map((item, index) => (
                      <ImageListItem key={item.id} onClick={() => openMedia(item)} >
                        <div className="image-container relative w-full h-auto group  overflow-hidden  ">
                          {/* Random Animation for Image */}
                          {getRandomAnimation() === 'zoom' ? (
                            <Zoom>
                              <img
                                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                                className='rounded-tl-2xl rounded-br-2xl hover:scale-125 duration-1000 transition-transform'
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  objectFit: 'cover',

                                }}
                              />
                            </Zoom>
                          ) : getRandomAnimation() === 'fadeLeft' ? (
                            <Fade direction="left">
                              <img
                                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                                className='rounded-tl-2xl rounded-br-2xl transition-transform duration-1000 hover:scale-125 ease-in-out'
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  objectFit: 'cover',

                                }}
                              />
                            </Fade>
                          ) : getRandomAnimation() === 'fadeRight' ? (
                            <Fade direction="right">
                              <img
                                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                                className='rounded-tl-2xl rounded-br-2xl transition-transform duration-1000 hover:scale-125 ease-in-out'
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  objectFit: 'cover',

                                }}
                              />
                            </Fade>
                          ) : (
                            <Fade direction='left'>
                              <img
                                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                                className='rounded-tl-2xl rounded-br-2xl transition-transform duration-1000 hover:scale-125 ease-in-out'
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  objectFit: 'cover',

                                }}
                              />
                            </Fade>
                          )}
                        </div>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              </div>

              {openModal && (
                <div
                  className="fixed inset-0 bg-black  flex justify-center items-center z-50"
                  onClick={closeModal}
                >
                  <div
                    className="rounded-lg p-4 relative max-w-3xl w-full flex justify-center items-center "
                    onClick={(e) => e.stopPropagation()}
                  >
                    {currentMedia ? (
                      <img
                        src={currentMedia}

                        className="lg:w-full w-[60vw] lg:h-[80vh] h-auto object-cover rounded-tl-2xl rounded-br-2xl hover:scale-105 duration-1000 transition-all"
                      />
                    ) : ""}
                  </div>
                </div>
              )}

            </div>
            <div className='space-y-5 py-10 lg:py-20 '>
              <h1 className="heading">{story.title}</h1>
              <p className="para leading-5"
                style={{
                  whiteSpace: "pre-wrap",
                  paddingTop: "10px",

                }}>{story.des}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Story not found</p>
      )}
    </div>
  );
};

export default SingleStory;

