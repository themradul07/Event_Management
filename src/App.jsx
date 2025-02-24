import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import Secondpage from './pages/Secondpage';
import AllEvents from './pages/AllEvents';
import AboutUs from './pages/AboutUs';
import LoginPage from './pages/LoginPage';
import './App.css';
import CreateEventForm from './pages/CreateEvent';
import EventPage from './pages/EventPage';
// import Real from './pages/Real';
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './pages/Dashboard';
import LiterarySubCouncil from './pages/LiterarySubCouncil';

const App = () => {
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname === '/login';

  const obj = { images: ["./lscLogo.jpg", "pfaLogo.jpg", "sportLogo.jpg", "cscLogo.jpg"], title : "xyz "  , desc : "The Council of Student Activity enhances campus life by organizing events, fostering leadership, and encouraging student engagement. It provides a platform for creativity, collaboration, and personal growth, ensuring a dynamic and inclusive college experience.", subparts : [] , }

  return (
    <>
     {/* <div className="absolute inset-0 -z-10 h-fit w-full bg-white bg-[linear-gradient(to_ right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"> */}

      {/* Conditionally render Navbar and Footer */}
      {!hideNavbarAndFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="council" element={<Secondpage title={"COUNCIL OF STUDENT ACTIVITY"} photos={obj.images}  desc={obj.desc} />} />
        <Route path="cells" element={<Secondpage title={"CELLS"} photos={obj.cells} />} />
        <Route path="clubs" element={<Secondpage title={"CLUBS"} photos={obj.clubs} />} />
        <Route path="events" element={<AllEvents />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="create" element={<CreateEventForm />} />
        <Route path="/council/lit" element={<LiterarySubCouncil />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* <Route path="real" element={<Real />} /> */}
        <Route path="/:id" element={<EventPage />} />
      </Routes>

      {!hideNavbarAndFooter && <Footer />}
      <ToastContainer
  position="bottom-right"
  theme="light"
  toastStyle={{ backgroundColor: "white", color: "black" }}
  progressStyle={{ background: "yellow" }} // Set purple background and white text
/>

     {/* </div> */}
    </>
  );
};

export default App;
