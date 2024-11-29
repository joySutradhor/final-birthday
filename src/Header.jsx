import React, { useEffect, useState } from 'react'
import { FaHome, FaBookOpen, FaImages, FaFilm } from 'react-icons/fa';
import { FaLongArrowAltRight } from "react-icons/fa";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { RiCloseLargeLine } from "react-icons/ri";
import { HashLink as Link } from 'react-router-hash-link';
import gift from "/gift.gif"
import { FaSignInAlt } from "react-icons/fa";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [story, setStory] = useState([]);

      // Fetch slide data
      useEffect(() => {
        fetch('https://birthday-gift-server.vercel.app/api/v1/storey')
            .then((response) => response.json())
            .then((data) => setStory(data.data))
            .catch((error) => console.error('Error fetching slides:', error));
    }, []);
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };
    return (

        <div className='bg-gradient-to-tr from-[#1F2A3E] to-[#3A424D]  opacity-90 w-full z-50 fixed top-0'>
            <div className='grid grid-cols-12 px-5 lg:px-16 items-center py-2 md:py-1 w-full'>
                {/* Left Column: Menu Icon */}
                <div className='col-span-1 flex justify-start'>
                    {/* Menu Icon */}
                    <div
                        className='cursor-pointer'
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <HiOutlineMenuAlt1 className='text-2xl md:text-4xl text-white/70' />
                    </div>
                </div>

                {/* Center Column: Title */}
                <div className='col-span-10 flex justify-center items-center'>
                    <Link smooth to="#home">
                        <div className='flex items-center'>
                            <h1 className='main__heading '> Happy Birthday Dear
                            </h1>
                            <img className='lg:size-20 size-10 ' src={gift} alt="" srcset="" />
                        </div>
                    </Link>
                </div>

                {/* Right Column: Empty space (to align text properly) */}
                <div className='col-span-1'></div>
            </div>

            {/* Sliding Menu */}
            <div
                className={`absolute top-0 left-0 bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] transition-transform duration-300 h-[100dvh] overflow-auto overflow-x-hidden p-4 md:p-8 w-[50vw] sm:w-[50vw] md:w-[30vw] lg:w-[25vw] xl:w-[20vw] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className='flex justify-end'>
                    {/* Close Icon */}
                    <RiCloseLargeLine
                        className='text-2xl md:text-3xl text-black/70 cursor-pointer'
                        onClick={() => setIsMenuOpen(false)}
                    />
                </div>
                <div className="flex flex-col space-y-4 mt-4 md:mt-8 text-xl">
                    <Link smooth to="/" onClick={handleLinkClick} className="menuItem">
                        <FaHome className="mr-2 inline" />
                        Home
                    </Link>
                    <Link smooth to="#story" onClick={handleLinkClick} className="menuItem">
                        <FaBookOpen className="mr-2 inline" />
                        Story Telling
                    </Link>
                    <Link smooth to="#gallery" onClick={handleLinkClick} className="menuItem">
                        <FaImages className="mr-2 inline" />
                        Photo Gallery
                    </Link>
                    <Link smooth to="#videos" onClick={handleLinkClick} className="menuItem">
                        <FaFilm className="mr-2 inline" />
                        Video Frame
                    </Link>

                    {
                        story?.map((data, index) => (
                            <Link key={index} onClick={handleLinkClick} to={`/story/${data._id}`} className='truncate max-w-xs menuItem flex gap-2 items-center'><span><FaLongArrowAltRight /></span> {data.title}</Link>
                        ))
                    }

                    {/* Button to go to the login page (Dashboard Link) */}
                    <Link to="/login" className="menuItem pt-10">
                        <FaSignInAlt className="mr-2 inline" />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header