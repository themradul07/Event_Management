import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ title, description, img, category, mon, date, time, medium, venue, isPaid, isExclusive }) => {
    const navigate = useNavigate();
    const [sdate, setsdate] = useState("");
    const [Smonth, setSmonth] = useState("");

    useEffect(() => {
        let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        setsdate(() => {
            try {
                let mod = date.split('T')[0].split('-')[2];
                return mod;
            } catch {
                return date;
            }
        });

        setSmonth(() => {
            try {
                let mod = date.split('T')[0].split('-')[1];
                return months[mod - 1];
            } catch {
                return mon;
            }
        });
    }, [date, mon]);

    const handleCardClick = () => {
        if (title) {
            navigate(`/event/${encodeURIComponent(title)}`);
        }
    };

    return (
        <div 
            onClick={handleCardClick}
            className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer w-72 h-fit flex flex-col justify-between"
        >
            <div className="relative w-full h-[180px]">
                <img src={img} className="object-cover bg-purple-300 w-full h-full" alt={title || "Event"} />
                <div className="absolute p-2 w-full flex justify-between items-start top-0 left-0">
                    <div className='flex gap-2 flex-wrap'> 
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 shadow-sm">
                            {category}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${isPaid ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                            {isPaid ? "Paid" : "Free"}
                        </span>
                        {isExclusive && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-300 shadow-sm">
                                👑 Exclusive
                            </span>
                        )}
                    </div>
                    <div className="text-right bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md shadow-sm">
                        <div className="text-xs font-semibold text-purple-600">{Smonth}</div>
                        <div className="text-lg font-bold text-gray-900">{sdate}</div>
                    </div>
                </div>
            </div>

            <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">{title}</h3>
                    {venue && (
                        <p className="text-xs text-gray-500 mb-3 truncate">
                            📍 {venue} {medium ? `(${medium})` : ''}
                        </p>
                    )}
                </div>

                <div className="mt-2 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-purple-600 hover:text-purple-800">
                        View Details →
                    </span>
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                        className="rounded-md bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs font-medium transition-colors"
                    >
                        Participate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card
