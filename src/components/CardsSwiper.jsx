import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const CardsSwiper = () => {
  return (
    
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {[1, 2, 3, 4, 5].map((event, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[350px] h-[250px]">
              <img
                // src={`https://via.placeholder.com/300x200?text=Event+${index + 1}`}
                src={`./Section.png`}
                alt="Event"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Event {index + 1}</h3>
                <p className="text-gray-600">January 25, 2025</p>
                <p className="text-gray-800 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <a href="#" className="text-blue-600 mt-2 block">View Details</a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    
  );
};

export default CardsSwiper;
