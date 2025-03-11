import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [ParticipantArr, setParticipantArr] = useState([]);
    const [Data, setData] = useState({});
    const [isRegister, setIsRegister] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    // const [isParicipated, setIsParicipated] = useState(false);

    const isRegistered = async () => {
        
            console.log("Started")
            let val = await fetch(`https://event-management-7ifl.onrender.com/register/part/${id}` , {credentials: "include"});
            // let val = await fetch(`http://localhost/register/part/${id}` , {credentials: "include"});
            let value = await val.json();
            console.log("Hello")
            console.log(value)
            setIsRegister(value.participated);
          
        
         
    }
    

    const getNavbarEvent = async () => {
        try {
            let response = await fetch("https://event-management-7ifl.onrender.com/getNavbar", {
                credentials: "include",
            });
            // let response = await fetch("http://localhost:3000/getNavbar", {
            //     credentials: "include",
            // });
            let res = await response.json();
            
            if (!res) navigate("/login");
            if (res.isAdmin) {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error("Error fetching navbar data:", error);
            navigate("/login");
        }
    };

    const getdata = async (val) => {
        let data = await fetch(`https://event-management-7ifl.onrender.com/event/${val}`, {
            credentials: "include",
        });
        // let data = await fetch(`http://localhost:3000/event/${val}`, {
        //     credentials: "include",
        // });
        let jsonData = await data.json();
        if (jsonData.value) {
            toast.error("Login First");
            navigate("/login");
        }
        setData(jsonData[0]);
        setParticipantArr(jsonData[0].participants);
        console.log(jsonData[0].participants.indexOf())
    };

    // Check if the event is expired
    useEffect(() => {
        if (Data.date) {
            const expiryDate = new Date(Data.date); // Parse event date
            const today = new Date(); // Current date

            // Normalize both dates to only compare YYYY-MM-DD
            expiryDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            setIsExpired(expiryDate < today);
        }
    }, [Data.date]); // Runs when `Data.date` updates

    useEffect(() => {
        getNavbarEvent();
        getdata(id);
        
        isRegistered();

    }, []);

    useEffect(() => {
      
    }, [isRegister])
    

    const handleRegister = async () => {
        if (isExpired) {
            toast.error("Event Expired");
            return;
        }
        try {
            // const response = await fetch(
            //     `http://localhost:3000/register/${Data.title}`,
            //     {
            //         method: "POST",
            //         credentials: "include",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify({ title: Data.title }),
            //     }
            // );
            const response = await fetch(
                `https://event-management-7ifl.onrender.com/register/${Data.title}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title: Data.title }),
                }
            );

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const tempData = await response.json();
            if (tempData.task) {
                setIsRegister(true);
                toast.success("Registered Successfully!");
            }
        } catch (error) {
            console.error("Registration failed:", error.message);
        }
    };

    return (
        <main className="">
            {/* Event Banner */}
            <div className="relative h-[400px] bg-gradient-to-r from-purple-800 to-purple-400 flex flex-col items-center">
                <div className="absolute inset-0 bg-black opacity-0"></div>
                <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="text-white w-2/3 mr-4">
                        <h1 className="text-4xl font-bold mb-4">{Data.title}</h1>
                        <p className="text-xl mb-6">
                            An inter-college literary event where creativity
                            meets expression
                        </p>
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <i className="fas fa-calendar-alt mr-2"></i>{" "}
                                {Data.date}
                            </span>
                            <span className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-2"></i>
                                {Data.venue}, BIET Jhansi
                            </span>
                        </div>
                    </div>
                    <div className="relative w-1/3">
                        <img
                            src={Data.img}
                            alt={Data.title}
                            className="rounded-lg shadow-lg object-cover h-[270px] w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Registration Section */}
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
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                About the Event
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {Data.description}
                            </p>
                        </div>
                    </div>

                    {/* Registration Button */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                            <div className="text-center mb-6">
                                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                    FREE EVENT
                                </span>
                            </div>

                            {!isRegister ? (
                                <button
                                    className={`w-full py-3 !rounded-button font-medium mb-4 transition-colors ${
                                        isExpired
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#8257DB] text-white hover:bg-[#9B7BE1]"
                                    }`}
                                    onClick={handleRegister}
                                    disabled={isExpired}
                                >
                                    {isExpired
                                        ? "Registration Closed"
                                        : "Register Now"}
                                </button>
                            ) : (
                                <button className="w-full bg-red-400 text-white py-3 !rounded-button font-medium mb-4">
                                    Already Registered
                                </button>
                            )}

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-medium">
                                        {Data.date}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Venue</span>
                                    <span className="font-medium">
                                        {Data.venue}
                                    </span>
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
    );
};

export default EventPage;
