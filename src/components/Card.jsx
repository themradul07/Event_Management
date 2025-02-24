import React from 'react'

const Card = ({title, description, img , category, mon , date,  time , medium, venue}) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer max-w-72 h-[480px]" onClick={() => window.location.href='/event/validation-customer-problem-fit'}>
            <div className="w-full h-[180px]">
                <img src={img} className="object-cover w-full h-full" alt="Customer Validation Event" />
            </div>
            <div className="p-4 flex flex-col justify-between h-[calc(100%-180px)]">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-500">
                            <i className="fas fa-users mr-1"></i>{category}
                        </span>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-purple-500">{mon}</div>
                            <div className="text-2xl font-bold text-gray-900">{date}</div>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{title}</h3>
                    <p className="text-gray-700 text-sm line-clamp-2">{description}</p>
                </div>
                <div>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                        <i className="fas fa-clock mr-2"></i>{time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-2"></i>{venue} ({medium})
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                        <button className="rounded-lg bg-purple-500 text-white px-4 py-2 text-sm font-medium">RSVP Now</button>
                        <div className="flex space-x-2">
                            <button className="text-gray-600 hover:text-gray-900">
                                <i className="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Card
