import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Gallery from "./Gallery";
import Hero from "./Hero";
import "./index.css";
import Videos from "./Videos";

function App() {
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleHover = () => {
    if (audioRef.current) {
      audioRef.current.muted = false; 
      audioRef.current.play();
    }
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
      <section
        className="bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE]"
        onMouseDownCapture={handleHover} 
      >
        <div>
          <audio
            ref={audioRef}
            src={musicData[0]?.musicUrl}
            loop
            autoPlay
            muted 
          ></audio>
        </div>
        <Hero />
        <Gallery musicData={musicData} />
        <Videos />
      </section>
    </>
  );
}

export default App;
