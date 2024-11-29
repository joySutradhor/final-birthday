import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css';

import { FaQuoteLeft } from "react-icons/fa";




// import required modules
import { Autoplay, EffectCreative, Navigation, Pagination, Keyboard } from 'swiper/modules';
import Header from './Header';


export default function Hero() {
    const [slides, setSlides] = useState([]);
   
    // Fetch slide data
    useEffect(() => {
        fetch('https://birthday-gift-server.vercel.app/api/v1/slider')
            .then((response) => response.json())
            .then((data) => setSlides(data.data))
            .catch((error) => console.error('Error fetching slides:', error));
    }, []);





    return (
        <section className='relative' id='home'>
           <Header/>
            <Swiper
                spaceBetween={30}
                grabCursor={true}
                navigation={true}
                keyboard={{
                    enabled: true,
                    onlyInViewport: true,
                }}
                pagination={{
                    clickable: true,
                }}
                effect={'creative'}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: [0, 0, -400],
                    },
                    next: {
                        translate: ['100%', 0, 0],
                    },
                }}

                modules={[Autoplay, EffectCreative, Navigation, Pagination, Keyboard]}
                className="mySwiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className=''>
                        <img
                            className='brightness-50'
                            src={slide.img}
                            alt={slide.title}
                            loading="lazy"
                        />
                        <div className="slide-content">
                            <h1 className='hero__heading mb-8  '> <span> <FaQuoteLeft /></span> <span>{slide.title}</span>  </h1>
                            <p className='hero__para'>{slide.des}</p>
                        </div>
                    </SwiperSlide>

                ))}
            </Swiper>
        </section>
    );
}
