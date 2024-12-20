import React, { useEffect, useState } from 'react'
import { FaHome, FaImages, FaFilm } from 'react-icons/fa';
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { RiCloseLargeLine } from "react-icons/ri";
import { HashLink as Link } from 'react-router-hash-link';
import { RiQuillPenAiLine } from "react-icons/ri";


import { FaSignInAlt } from "react-icons/fa";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [story, setStory] = useState([]);

      // Fetch slide data
      useEffect(() => {
        fetch('https://leon-final-server-iwnx.vercel.app/api/v1/storey')
            .then((response) => response.json())
            .then((data) => setStory(data.data))
            .catch((error) => console.error('Error fetching slides:', error));
    }, []);
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };
    return (

        <div className='bg-gradient-to-tr from-[#1F2A3E] to-[#3A424D] z-50  opacity-95 w-full  sticky top-0'>
            <div className='grid grid-cols-12 px-5 lg:px-16 items-center py-2 md:py-4 xl:py-1 w-full'>
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
                        <div className='flex items-center py-3'>
                            <h1 className='main__heading flex items-center gap-2 group'><span className='group-hover:text-red-400 duration-500 ease-in-out transition-colors animate-pulse' > ❤ </span>  Maren & Leon <span className='group-hover:text-red-400 duration-500 ease-in-out transition-colors animate-pulse'> ❤ </span>
                            </h1>
                            {/* <img className='lg:size-20 size-10 ' src={gift} alt="" srcset="" /> */}
                        </div>
                    </Link>
                </div>

                {/* Right Column: Empty space (to align text properly) */}
                <div className='col-span-1'></div>
            </div>

            {/* Sliding Menu */}
            <div
                className={`absolute top-0 left-0 bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] transition-transform duration-300 h-[100dvh] overflow-auto overflow-x-hidden p-4 md:p-8 w-[90vw] sm:w-[80vw] md:w-[50vw] lg:w-[35vw] xl:w-[28vw] 2xl:w-[20vw] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
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

                    <Link smooth to="#gallery" onClick={handleLinkClick} className="menuItem">
                        <FaImages className="mr-2 inline" />
                        Fotos
                    </Link>
                    <Link smooth to="#videos" onClick={handleLinkClick} className="menuItem">
                        <FaFilm className="mr-2 inline" />
                        Videos
                    </Link>

                    {
                        story?.map((data, index) => (
                            <Link key={index} onClick={handleLinkClick} to={`/story/${data._id}`} className=' menuItem flex gap-2 items-start'><span><RiQuillPenAiLine className='text-2xl mt-2' /></span> {data.title}</Link>
                        ))
                    }

                    {/* Button to go to the login page (Dashboard Link) */}
                    <Link to="/dashboard" className="menuItem pt-10">
                        <FaSignInAlt className="mr-2 inline" />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header