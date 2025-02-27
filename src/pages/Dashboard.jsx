import React from "react";
import { useEffect ,useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
    const [Data, setData] = useState({});
    const [EventArr, setEventArr] = useState([]);
    const [NoEvents, setNoEvents] = useState(0);
    const navigate = useNavigate();

    const getdata = async() => {
        try{
        let user = await fetch("http://localhost:3000/profile", {credentials: "include"});
        let resData = await user.json();
        console.log(resData.participated);
        setData(resData);
        setEventArr(resData.participated);
        setNoEvents(resData.participated.length);
        }
        catch{
            toast.error("Login First !")
            navigate("/login");

        }
      
    }

    useEffect(() => {
      getdata();
    }, [])
    
    


  return (
    <div className="bg-white flex justify-center items-center min-h-screen max-w-[1240px] mx-auto w-full">
      <div className="w-full min-h-screen flex perspective-1000 relative bg-white shadow-lg overflow-hidden">
       

        {/* Main Content */}
        <main className="flex-1  p-8 transition-transform  w-full">
          {/* <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">John Smith</p>
                  <p className="text-xs text-gray-500">Computer Science, 3rd Year</p>
                </div>
                <img src="profile.jpg" alt="Profile" className="h-10 w-10 rounded-full object-cover border-2 border-gray-300 hover:border-[#9333EA] transition-all" />
              </div>
            </div>
          </header> */}

          <div className="mx-auto px-4 sm:px-6 lg:px-8 min-h-[300px] ">
            <div className="bg-[#9333EA] rounded-lg shadow-lg px-6 py-24 flex flex-col justify-between mb-8 hover:shadow-2xl transition-all">
              <div className="text-white">
                <h1 className="text-2xl font-bold">Welcome back, {Data.name}</h1>
                <p className="mt-1 text-white/80">Track your event participation and achievements</p>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-6">
                {["Total Events", "Certificates Earned", "Points Earned"].map((title, index) => (
                  <div key={index} className="bg-[#A855F7]/30 rounded-lg p-4 hover:bg-[#7E22CE] transition-all">
                    <p className="text-white/80 text-sm">{title}</p>
                    <p className="text-white text-2xl font-bold mt-1">{[NoEvents, NoEvents, NoEvents*100][index]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Events Participated</h2>
                <button className="bg-[#9333EA] hover:bg-[#7E22CE] text-white px-4 py-2 text-sm rounded transition-all">
                  <i className="fas fa-plus mr-2"></i>Find More Events
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {EventArr.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Not Now Available</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded bg-green-100`}>Upcoming</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
