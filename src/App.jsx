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
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname === '/login';

  return (
    <div className="absolute inset-0 -z-10 h-fit w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">

      {/* Conditionally render Navbar and Footer */}
      {!hideNavbarAndFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="council" element={<Secondpage />} />
        <Route path="events" element={<AllEvents />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="create" element={<CreateEventForm />} />
        <Route path="/:id" element={<EventPage />} />
      </Routes>

      {!hideNavbarAndFooter && <Footer />}
      <ToastContainer
  position="bottom-right"
  theme="light"
  toastStyle={{ backgroundColor: "white", color: "black" }}
  progressStyle={{ background: "yellow" }} // Set purple background and white text
/>

    </div>
  );
};

export default App;
