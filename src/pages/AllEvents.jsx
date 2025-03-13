import React from 'react'

import Card from '../components/Card'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
// import { data } from '../../data'

const AllEvents = () => {

    const [AllEvents, setAllEvents] = useState([]);
    const [Events, setEvents] = useState([]);
    const [activeButton, setActiveButton] = useState("");



    const getEvents = async () => {
        try {
            const fetchingevents = await fetch("https://event-management-7ifl.onrender.com/", { credentials: "include" });
            const fetchevents = await fetchingevents.json();

            // console.log(fetchevents[5].date.split('T')[0].split('-')[2]);
            setAllEvents(fetchevents);
            setEvents(fetchevents);
            // console.log(AllEvents);
        } catch (error) {
            console.log(error);
        }
    };

    const handleMedium = (e) => {
        if (e.target.name == '') {
            setAllEvents(Events);
            return;
        }
        let filteredArray = Events.filter((item) => { return item.medium == e.target.name; })
        setAllEvents(filteredArray);


    }


    useEffect(() => {
        getEvents();


    }, []);

    const btnClass = "rounded-full border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white";
    const activeBtnClass = "bg-purple-900 text-white";


    const handleClick = (e) => {
        setActiveButton(e.target.name);
        let filteredArray = Events.filter((item) => { return item.category == e.target.name; }
        )
        setAllEvents(filteredArray);
        console.log(filteredArray);
        // console.log(data)
    };








    return (
        <div className='min-h-[100vh]'>

            {/* main upar */}
            <div className='h-[20vh] px-8 text-3xl font-light text-center  flex justify-center items-center text-white overflow-hidden bg-gradient-to-r from-purple-400 to-purple-400'>

                Explore the best events happening around you

            </div>

            {/* cards section */}
            <main className=" pb-12 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 bg-white text-gray-900">

                {/* all events / offline / online */}



                {/*filter portion  */}
                <div className="p-6 border-b flex flex-wrap gap-4 mb-8 items-center justify-start">
                    <button onClick={() => {
                        setAllEvents(Events);
                        setActiveButton("");
                    }


                    } name='' className="rounded-full bg-white border border-purple-600 px-4 py-2 text-sm font-medium text-black hover:bg-purple-500 hover:text-white">
                        Remove Filter
                    </button>

                    <button onClick={handleClick} name='Literary' className={`${btnClass} ${activeButton === 'Literary' ? activeBtnClass : ''}`}>
                        <i className="fas fa-book mr-2"></i> Literary
                    </button>
                    <button onClick={handleClick} name='Photography' className={`${btnClass} ${activeButton === 'Photography' ? activeBtnClass : ''}`}>
                        <i className="fas fa-camera mr-2"></i> Photography
                    </button>
                    <button onClick={handleClick} name='Fine Arts' className={`${btnClass} ${activeButton === 'Fine Arts' ? activeBtnClass : ''}`}>
                        <i className="fas fa-palette mr-2"></i> Fine Arts
                    </button>
                    <button onClick={handleClick} name='Cultural' className={`${btnClass} ${activeButton === 'Cultural' ? activeBtnClass : ''}`}>
                        <i className="fas fa-theater-masks mr-2"></i> Cultural
                    </button>
                    <button onClick={handleClick} name='TPC' className={`${btnClass} ${activeButton === 'TPC' ? activeBtnClass : ''}`}>
                        <i className="fas fa-users mr-2"></i> TPC
                    </button>
                    <button onClick={handleClick} name='IIC' className={`${btnClass} ${activeButton === 'IIC' ? activeBtnClass : ''}`}>
                        <i className="fas fa-globe mr-2"></i> IIC
                    </button>
                    <button onClick={handleClick} name='Alumni Association' className={`${btnClass} ${activeButton === 'Alumni Association' ? activeBtnClass : ''}`}>
                        <i className="fas fa-graduation-cap mr-2"></i> Alumni Association
                    </button>
                    <button onClick={handleClick} name='Mercenary Motorsports' className={`${btnClass} ${activeButton === 'Mercenary Motorsports' ? activeBtnClass : ''}`}>
                        <i className="fas fa-car-side mr-2"></i> Mercenary Motorsports
                    </button>
                    <button onClick={handleClick} name='The Drone Learners Club' className={`${btnClass} ${activeButton === 'The Drone Learners Club' ? activeBtnClass : ''}`}>
                        <i className="fas fa-drone mr-2"></i> The Drone Learners Club
                    </button>
                </div>




                {AllEvents.length == 0 && <div className='w-full mx-auto text-center'>No Events to Show</div>}
                <div className='w-full mx-auto'>

                    <div
                        // className='flex flex-wrap gap-4 w-full mx-auto text-center justify-center items-center max-w-[1540px]'
                        className="max-w-[1540px] gap-2 grid mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300"
                    >

                        {AllEvents.reverse().map((e, index) => {
                            return <div key={index} className='w-full flex justify-center'> <a href={`/${e.title}`}>
                                <Card img={e.img} isPaid={e.isPaid} category={e.category} mon={e.month} title={e.title} date={e.date} description={e.description} time={e.time} medium={e.medium} venue={e.venue} />
                            </a>
                            </div>

                        })}





                    </div>
                </div>

            </main>



        </div>
    )
}

export default AllEvents