import React from "react";
import Card from "../components/Card";
import { Councildata } from "../../data";
import { useState ,useEffect } from "react";

const LiterarySubCouncil = ({ q }) => {
  const [AllEvents, setAllEvents] = useState([]);

  const getEvents = async () => {
    try {
      const fetchingevents = await fetch("https://event-management-7ifl.onrender.com/", { credentials: "include" });
      const fetchevents = await fetchingevents.json();

      // console.log(fetchevents[5].date.split('T')[0].split('-')[2]);
      setAllEvents(fetchevents);
      
      // console.log(AllEvents);
      console.log("value:",q)
      console.log(fetchevents);
      let filteredArray = fetchevents.filter((item) => { return item.category == q }
      )
      setAllEvents(filteredArray);
      console.log(filteredArray);
    } catch (error) {
      console.log(error);
    }
  };

  

  useEffect(() => {
    getEvents();
    
    


  }, []);

  

  

  const data = Councildata.filter((e) => {
    return e.category == q;

  })[0];

  console.log(data);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white">


      {/* Main Content */}
      <div className='h-[30vh] px-8 text-4xl  font-light text-center  flex justify-center items-center text-white overflow-hidden bg-gradient-to-r from-purple-400 to-purple-400'>

        {data.title}

      </div>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-3 pt-10 pb-20   text-center">
          <div className="max-w-6xl  mx-auto">

            <p className="font-light md:text-xl text-gray-600 text-lg max-w-3xl mx-auto" >
              {data.desc}
            </p>
            <img src={data.pic} className="w-full min-h-90 h-fit object-fit rounded-lg mt-12 shadow-xl" />
          </div>
        </section>

        {/* Major Events */}
        <section className="px-6 py-20 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-purple-800 mb-12 text-center">UPCOMING EVENTS </h2>
            <div className=" grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
              {AllEvents.length == 0 && <div className='w-full mx-auto text-center'>No Events to Show</div>}
              <div className='w-full mx-auto'>

                <div className="max-w-[1540px]  md:gap-80 gap-4 grid mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300"
                >

                  {AllEvents.reverse().map((e, index) => {
                    return <div key={index} className='w-full flex justify-center scale-90 md:scale-100'> <a href={`/${e.title}`}>
                      <Card img={e.img} isPaid={e.isPaid} category={e.category} mon={e.month} title={e.title} date={e.date} description={e.description} time={e.time} medium={e.medium} venue={e.venue} />
                    </a>
                    </div>

                  })}

                </div>
              </div>
              {/* <div className="bg-white rounded-lg shadow-xl p-6">
                <img src="/2lit.jpeg" alt="Magnum Opus" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">MAGNUM OPUS 2024 - Our Annual Literary Fest</h3>
                <p className="text-gray-600 mb-4">
                  Our flagship literary extravaganza witnessed prestigious competitions, engaging workshops, panel discussions, and renowned speakers from across the country.
                </p>
                <span className="text-sm font-medium text-custom flex items-center justify-center gap-2">15-17 March, 2024</span>
              </div> */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {data.glimpse.map((image, index) => (
                  <img key={index} src={`/${image}`} alt="Event Glimpse" className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {q==="Literary"?[
                { name: "Ekta Pandey", role: "Officer-In Charge", img: "ek.jpeg" },
                { name: "Abhishek Pratap Singh (ECE)", role: "Secretary", img: "ab.jpg" },
                { name: "Anushka Jaiswal (CSE)", role: "Secretary", img: "an.jpg" },
                { name: "Abhishek Kr. Dixit (IT)", role: "Joint Secretary", img: "abd.jpg" },
                { name: "Palak Verma", role: "Joint Secretary", img: "pv.jpg" },
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-xl p-6 text-center">
                  <img src={`/${member.img}`} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              )):[
                { name: "Person 1", role: "Officer-In Charge", img: "pfp.png" },
                { name: "Person 2", role: "Secretary", img: "pfp.png" },
                { name: "Person 3", role: "Secretary", img: "pfp.png" },
                { name: "Person 4", role: "Joint Secretary", img: "pfp.png" },
                { name: "Person 5", role: "Joint Secretary", img: "pfp.png" },
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-xl p-6 text-center">
                  <img src={`/${member.img}`} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))
              }
            </div>
          </div>
        </section>
      </main>


    </div>
  );
};

export default LiterarySubCouncil;
