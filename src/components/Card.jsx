import React from 'react'
import { useState, useEffect } from 'react';

const Card = ({ title, description, img, category, mon, date, time, medium, venue, isPaid }) => {
    // const datemodify = date.split('T')[0].split('-')[2];
    const [sdate, setsdate] = useState("");
    const [Smonth, setSmonth] = useState("");

    useEffect(() => {
        let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        setsdate(() => {
            try {
                let mod = date.split('T')[0].split('-')[2];

                return mod;
            }
            catch {
                return date;
            }
        })
        setSmonth(() => {
            try {
                let mod = date.split('T')[0].split('-')[1];
                //  console.log("Hello");
                console.log(title)
                console.log(months[mod - 1]);
                return months[mod - 1];
            }
            catch {
                console.log(title);
                console.log("Error pe error ho raha !!!!!")
                return mon;
            }

        })

    }, [])


    return (
        // <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer w-72 h-fit" onClick={() => window.location.href = '/event/validation-customer-problem-fit'}>
        //     <div className="relative w-full h-[180px]">
        //         <img src={img} className="object-cover w-full h-full" alt="Customer Validation Event" />
        //         <div className="absolute flex justify-between items-start mt-0">
        //             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-500">
        //                 <i className="fas fa-users mr-1"></i>{category}
        //             </span>
        //             <div className="text-right">
        //                 <div className="text-sm font-semibold text-purple-500">{Smonth}</div>
        //                 <div className="text-2xl font-bold text-gray-900">{sdate}</div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="p-4 flex flex-col justify-between h-[calc(100%-180px)]">
        //         <div>
        //             <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{title}</h3>
        //             {/* <p className="text-gray-700 text-sm line-clamp-2">{description}</p> */}
        //         </div>
        //         <div>
        //             {/* <div className="flex items-center text-sm text-gray-600 mt-2">
        //                 <i className="fas fa-clock mr-2"></i>{time}
        //             </div>
        //             <div className="flex items-center text-sm text-gray-600">
        //                 <i className="fas fa-map-marker-alt mr-2"></i>{venue} ({medium})
        //             </div> */}
        //             <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
        //                 <button className="rounded-lg bg-purple-500 text-white px-4 py-2 text-sm font-medium">Participate Now</button>
        //                 <div className="flex space-x-2">
        //                     <button className="text-gray-600 hover:text-gray-900">
        //                         <i className="fas fa-share-alt"></i>
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="bg-gray-100  shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer w-72 h-fit">
            <div className="relative w-full h-[180px]">
                <img src={img} className="object-cover bg-purple-300 w-full h-full" alt="Customer Validation Event" />
            </div>
                <div className="absolute p-2  w-full flex justify-between items-start mt-0">
                    <div className='flex gap-2'> 

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-500">
                        <i className="fas fa-users mr-1"></i>{category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-500">
                        {isPaid?"Paid":"Free"}
                    </span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-semibold text-purple-500">{Smonth}</div>
                        <div className="text-2xl font-bold text-gray-900">{sdate}</div>
                    </div>
                </div>
            <div className="p-4 mt-7 flex flex-col justify-between h-[calc(100%-180px)]">
                <div>
                    <h3 className="text-lg max-w-[80%] h-fit font-semibold text-gray-900 mb-1 ">{title}</h3>
                    {/* <p className="text-gray-700 text-sm line-clamp-2">{description}</p> */}
                </div>
                <div>
                    {/* <div className="flex items-center text-sm text-gray-600 mt-2">
                        <i className="fas fa-clock mr-2"></i>{time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-2"></i>{venue} ({medium})
                    </div> */}
                    {/* <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                        <button className="rounded-lg bg-purple-500 text-white px-4 py-2 text-sm font-medium">Participate Now</button>
                        <div className="flex space-x-2">
                            <button className="text-gray-600 hover:text-gray-900">
                                <i className="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Card
