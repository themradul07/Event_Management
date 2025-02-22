import React from 'react'

import Card from '../components/Card'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const AllEvents = () => {

    const [AllEvents, setAllEvents] = useState([]);
    const getEvents = async () => {
      try {
        
        const fetchingevents = await fetch("http://localhost:3000/" ,{credentials: "include"});
        const fetchevents = await fetchingevents.json();
        console.log(fetchevents);
        
        setAllEvents(fetchevents);
        // console.log(AllEvents);
        
        

      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
        getEvents();
        
    }, []);

    
    



    return (
        <div className='min-h-[100vh]'>

            {/* main upar */}
            <div className='h-[20vh] px-8 text-3xl font-light text-center  flex justify-center items-center text-white overflow-hidden bg-gradient-to-r from-purple-400 to-purple-400'>

                Explore the best events happening around you

            </div>

            {/* cards section */}
            <main className=" pb-12 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 bg-white text-gray-900">

                {/* all events / offline / online */}
                <div className="flex justify-between mb-8 pt-4 border-b border-gray-300">
                    <nav className="flex space-x-8 items-center">
                        <button className="border-b-2 border-purple-500 text-purple-500 px-1 py-4 text-sm font-medium cursor-pointer transition-colors duration-200">
                            All Events
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 px-1 py-4 text-sm font-medium cursor-pointer transition-colors duration-200">
                            Offline Events
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 px-1 py-4 text-sm font-medium cursor-pointer transition-colors duration-200">
                            Online Events
                        </button>
                    </nav>
                    <div>
                        <Link to={'/create'}>
                    <button className="text-gray-600 hover:text-gray-800 px-1 py-4 text-sm font-medium cursor-pointer transition-colors duration-200">
                            Create Event
                        </button>
                        </Link>

                    </div>
                </div>


                {/*filter portion  */}
                <div className="flex flex-wrap gap-4 mb-8 items-center justify-start">
                    <button className=" bg-purple-500 rounded-full text-white px-4 py-2 text-sm font-medium">
                        <i className="fas fa-book mr-2"></i> Literary
                    </button>

                    <button className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        <i className="fas fa-camera mr-2"></i> Photography
                    </button>

                    <button className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        <i className="fas fa-palette mr-2"></i> Fine Arts
                    </button>

                    <button className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        <i className="fas fa-theater-masks mr-2"></i> Cultural
                    </button>

                    <button className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        <i className="fas fa-users mr-2"></i> TPC
                    </button>

                    <button className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        <i className="fas fa-globe mr-2"></i> IIC
                    </button>

                    <button className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        <i className="fas fa-graduation-cap mr-2"></i> Alumni Association
                    </button>

                    <button className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        <i className="fas fa-car-side mr-2"></i> Mercenary Motorsports
                    </button>

                    <button className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        <i className="fas fa-drone mr-2"></i> The Drone Learner's Club
                    </button>
                </div>





                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300">
                    {/* <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick="window.location.href='/event/validation-customer-problem-fit'">
                        <div className="aspect-w-16 aspect-h-9">
                            <img src="event_tpc.jpg" className="object-cover" alt="Customer Validation Event" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-500">
                                    <i className="fas fa-users mr-1"></i>TPC
                                </span>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-purple-500">FEB</div>
                                    <div className="text-2xl font-bold text-gray-900">18</div>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Validation of Customer - Problem-fit</h3>
                            <p className="text-gray-700 text-sm mb-4">Join us for an insightful session on customer validation and problem-fit analysis.</p>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <i className="fas fa-clock mr-2"></i>12:15 PM - 1:15 PM
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <i className="fas fa-map-marker-alt mr-2"></i>IIC (Hybrid Mode)
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                                <button className="rounded-lg bg-purple-500 text-white px-4 py-2 text-sm font-medium">RSVP Now</button>
                                <div className="flex space-x-2">
                                    <button className="text-gray-400 hover:text-white">
                                        <i className="fas fa-share-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {AllEvents.map( (e) => {
                        return <a href={`/${e.title}`}>
                        <Card img={e.img} category={e.category} mon={e.month} title={e.title} date={e.date} description={e.description} time={e.time} medium={e.medium} venue={e.venue}/>
                        </a>
                    
                        
                    })} 


                    
                    
                    
                </div>

            </main>



        </div>
    )
}

export default AllEvents