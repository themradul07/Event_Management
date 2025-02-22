import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
const EventPage = () => {
    const { id } = useParams(); 

    const [Data, setData] = useState({});

    const getdata = async (val) => {

        let data = await fetch(`http://localhost:3000/event/${val}`, {credentials: "include"});
        let jsonData = await data.json();
        console.log(jsonData);
        setData(jsonData[0]);

      
    }
    

    useEffect(() => {
        getdata(id);
      
    }, [])
    

    
  return (
    <main className="">
    <div className="relative h-[400px] bg-gradient-to-r from-purple-800 to-purple-400 flex items-center">
        <div className="absolute inset-0 bg-black opacity-0"></div>
        <div className="relative max-w-8xl  mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="text-white w-2/3 mr-4">
                <h1 className="text-4xl font-bold mb-4">{Data.title}</h1>
                <p className="text-xl mb-6">An inter-college literary event where creativity meets expression</p>
                <div className="flex items-center space-x-4">
                    <span className="flex items-center"><i className="fas fa-calendar-alt mr-2"></i>{Data.month} {Data.date}, 2025</span>
                    <span className="flex items-center"><i className="fas fa-map-marker-alt mr-2"></i>{Data.venue}, BIET Jhansi</span>
                </div><div className="mt-4"><a href="https://rb.gy/e6ay8r" target="_blank" className="inline-flex items-center text-white hover:text-gray-200"><i className="fab fa-instagram text-xl mr-2"></i>Follow us on Instagram</a></div><div className="mt-4"><span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm mr-2">{Data.category}</span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">{Data.medium}</span>
                </div>
            </div>
        <div className="relative w-1/3"><img src={Data.img} alt="Inkspire Week 2025" className="rounded-lg shadow-lg object-cover h-[270px] w-full"/></div></div>
    </div>
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">About the Event</h2>
                    <p className="text-gray-600 mb-6">{Data.description}</p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What to Expect</h3>
                    <ul className="space-y-3 text-gray-600 mb-6"><li className="flex items-start"><i className="fas fa-check-circle text-[#8257DB] mt-1 mr-2"></i><span>Featured exposure on our social media platforms with full credits</span></li><li className="flex items-start"><i className="fas fa-check-circle text-[#8257DB] mt-1 mr-2"></i><span>Awards and recognition for winners at the conclusion</span></li><li className="flex items-start"><i className="fas fa-check-circle text-[#8257DB] mt-1 mr-2"></i><span>Networking opportunities with like-minded peers</span></li><li className="flex items-start"><i className="fas fa-check-circle text-[#8257DB] mt-1 mr-2"></i><span>Interactive workshops and hands-on sessions</span></li><li className="flex items-start"><i className="fas fa-check-circle text-[#8257DB] mt-1 mr-2"></i><span>Exhibition of latest technologies</span></li></ul>
                <div className="mt-6"><h3 className="text-xl font-semibold text-gray-900 mb-3">Submission Guidelines</h3><ul className="list-disc pl-5 text-gray-600"><li>All submissions must be original and plagiarism-free</li><li>Inappropriate or vulgar content will lead to disqualification</li><li>Poetry submissions are only accepted through the Google Form</li></ul></div></div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Event Schedule</h2>
                    <div className="space-y-6">
                        <div className="flex">
                            <div className="flex-shrink-0 w-24 text-[#8257DB] font-medium">9:00 AM</div>
                            <div>
                                <h4 className="font-medium text-gray-900">Registration &amp; Welcome Coffee</h4>
                                <p className="text-gray-600">Pick up your badge and enjoy morning refreshments</p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex-shrink-0 w-24 text-[#8257DB] font-medium">10:00 AM</div>
                            <div>
                                <h4 className="font-medium text-gray-900">Opening Keynote</h4>
                                <p className="text-gray-600">Future of Technology in Education</p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex-shrink-0 w-24 text-[#8257DB] font-medium">11:30 AM</div>
                            <div>
                                <h4 className="font-medium text-gray-900">Workshop Sessions</h4>
                                <p className="text-gray-600">Choose from multiple parallel tracks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                    <div className="text-center mb-6">
                        <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">FREE EVENT</span>
                    </div>
                    <button className="w-full bg-[#8257DB] text-white py-3 !rounded-button font-medium mb-4 hover:bg-[#9B7BE1] transition-colors"><a href="https://forms.gle/33psbdo5JxDCFRE46" target="_blank" className="w-full inline-block text-center">Register Now</a></button>
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600">Date</span>
                            <span className="font-medium">March 15, 2024</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600">Time</span>
                            <span className="font-medium">9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Venue</span>
                            <span className="font-medium">Multi Purpose Hall</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                        <button className="w-full border border-[#8257DB] text-[#8257DB] py-2 !rounded-button font-medium hover:bg-[#8257DB] hover:text-white transition-colors">
                            <i className="fas fa-share-alt mr-2"></i>
                            Share Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
  )
}

export default EventPage