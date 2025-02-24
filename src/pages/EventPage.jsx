import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const EventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [ParticipantArr, setParticipantArr] = useState([]);
    const [Data, setData] = useState({});
    const [isRegister, setIsRegister] = useState(false)

    const getNavbarEvent = async () => {
        try {
            let response = await fetch("http://localhost:3000/getNavbar", {
                credentials: "include",
            });
            let res = await response.json();
            console.log(res);
            if (!res) navigate('/login');
            if (res.isAdmin) {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error("Error fetching navbar data:", error);
            navigate('/login');
        }
    };

    const getdata = async (val) => {

        let data = await fetch(`http://localhost:3000/event/${val}`, { credentials: "include" });
        let jsonData = await data.json();
        if (jsonData.value) {
            toast.error("Login First");
            navigate('/login')
        }
        console.log(jsonData[0].participants);
        setData(jsonData[0]);

        setParticipantArr(jsonData[0].participants);


    }


    useEffect(() => {
        getNavbarEvent();
        getdata(id);
    }, []);

    const handleRegister = async () => {
        try {
            const response = await fetch(`http://localhost:3000/register/${Data.title}`, {
                method: "POST",
                credentials: "include", // Change to POST
                headers: {
                    "Content-Type": "application/json", // Specify JSON format
                },
                body: JSON.stringify({ title: Data.title }), // Send Data in request body
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const tempData = await response.json();
            if (tempData.task) {
                setIsRegister(true);
                toast.success("Registered Successfully !")
            }

            console.log(tempData);
        } catch (error) {
            console.error("Registration failed:", error.message);
        }
    };

    useEffect(() => {
    }, [isRegister]);

    return (
        <main className="">
            <div className="relative h-[400px] bg-gradient-to-r from-purple-800 to-purple-400 flex flex-col items-center">
                <div className="absolute inset-0 bg-black opacity-0"></div>
                {isAdmin && <div className=' p-3 w-full flex justify-end'>
                </div>}
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
                    <div className="relative w-1/3"><img src={Data.img} alt="Inkspire Week 2025" className="rounded-lg shadow-lg object-cover h-[270px] w-full" /></div></div>
            </div>
            {isAdmin ?
                <div className="bg-white flex justify-center items-center min-h-screen max-w-[1240px] mx-auto w-full">
                    <div className="w-full min-h-screen flex perspective-1000 relative bg-white shadow-lg overflow-hidden">
                        {/* Main Content */}
                        <main className="flex-1  p-8 transition-transform  w-full">
                            <div className="mx-auto px-4 sm:px-6 lg:px-8 min-h-[300px] ">
                                <div className="bg-[#9333EA] rounded-lg shadow-lg p-3 flex flex-col justify-between mb-8 hover:shadow-2xl transition-all">
                                    <div className="text-white">
                                        <h1 className="text-2xl font-bold">Admin Portal</h1>
                                        <p className="mt-1 text-white/80">Track your event participation</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6 mt-6">
                                        {["Total Participants"].map((title, index) => (
                                            <div key={index} className="bg-[#A855F7]/30 rounded-lg p-4 hover:bg-[#7E22CE] transition-all">
                                                <p className="text-white/80 text-sm">{title}</p>
                                                <p className="text-white text-2xl font-bold mt-1">{[ParticipantArr.length][index]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-semibold text-gray-900">Students Participated</h2>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {ParticipantArr.reverse().map((event, index) => (
                                            <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-all">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{event.name}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">{event.id}</p>
                                                    </div>
                                                    {/* <span className={`px-2 py-1 text-xs font-medium rounded bg-green-100`}>Upcoming</span> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div> :
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
                                {!isRegister ? <button className="w-full bg-[#8257DB] text-white py-3 !rounded-button font-medium mb-4 hover:bg-[#9B7BE1] transition-colors"><a onClick={handleRegister} target="_blank" className="w-full inline-block text-center">
                                    Register Now
                                </a></button> : <button className="w-full bg-red-400 text-white py-3 !rounded-button font-medium mb-4 hover:bg-[#9B7BE1] transition-colors"><a target="_blank" className="w-full inline-block text-center">
                                    Already Registered
                                </a></button>}
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
                </div>}
        </main>
    )
}

export default EventPage