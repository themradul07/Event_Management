import React from 'react';

const EventCard = ({date ,  type , title , month }) => {
    return (
        <div className="swiper-slide swiper-slide-active" style={{ width: '257px', marginRight: '20px' }}>
            <a className="w-full" href="/event/64e6211c1be02a3ae72c">
                <div className="relative">
                    <img 
                        src="https://cloud.appwrite.io/v1/storage/buckets/6488600b698ae8223e7c/files/64e6211a75840107906d/preview?project=64885b43d529fd22b538" 
                        alt="Journey Through the Multiverse: A UI/UX Adventure in the Marvel Universe" 
                        className="object-cover w-full rounded-lg aspect-video"
                    />
                    <div className="absolute m-2 rounded text-sm top-0 right-0 text-center font-semibold bg-white shadow p-2">
                        <h3>{date}</h3>
                        <p>{month}</p>
                    </div>
                    <div className="absolute m-2 rounded text-xs bottom-0 left-0 text-center bg-white shadow p-2">
                        <p>{type}</p>
                    </div>
                </div>
                <div className="py-4 space-y-2">
                    <h1 className="font-bold">{title}</h1>
                </div>
            </a>
        </div>
    );
};

export default EventCard;