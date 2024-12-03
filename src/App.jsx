import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Gallery from "./Gallery";
import Hero from "./Hero";
import "./index.css";
import Videos from "./Videos";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { BsPlayCircleFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

function App() {
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isPlayerVisible, setIsPlayerVisible] = useState(true); 
  const [showPlayButton, setShowPlayButton] = useState(false); 
  const [fade , setFade] = useState(false)
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://birthday-gift-web.vercel.app/api/v1/music"
        );
        setMusicData(response?.data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex + 1 < musicData.length ? prevIndex + 1 : 0
    );
  };

  const handleClosePlayer = () => {
    setFade(true)
    setShowPlayButton(true)
  };

  const handleShowPlayer = () => {
    setFade(false)
    setShowPlayButton(false)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">Loading...</div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <section className="bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE]">
        {/* Audio Player */}
        {isPlayerVisible && musicData.length > 0 && (
          <div className={`fixed bottom-5 right-5 p-4 bg-gray-800 rounded-lg shadow-lg z-50 w-[80%] xl:w-[30%] 2xl:w-[20%] ${fade? "hidden" : "block"}`}>
            <AudioPlayer
              ref={audioRef}
              src={musicData[currentTrackIndex]?.musicUrl}
              onEnded={handleNextTrack}
            />
            <button
              onClick={handleClosePlayer}
              className="absolute top-0 right-0 text-white bg-red-500 rounded-full p-2 hover:bg-red-700"
            >
              <AiOutlineClose />
            </button>
          </div>
        )}

        {/* Play Button to show after closing the player */}
        {showPlayButton && (
          <button
            onClick={handleShowPlayer}
            className="fixed bottom-5 right-5 p-4 z-50"
          >
            <BsPlayCircleFill className="text-5xl text-white/70" />
          </button>
        )}

        <Hero />
        <Gallery musicData={musicData} />
        <Videos />
      </section>
    </>
  );
}

export default App;
