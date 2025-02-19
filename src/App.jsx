import React from 'react'
import Navbar from './components/Navbar'
import MainPage from './pages/MainPage'
import Council from './components/Council'
import './App.css'
import Secondpage from './pages/Secondpage'
import Footer from './components/Footer'
import { Routes, Route } from "react-router-dom";
import AllEvents from './pages/AllEvents'
import AboutUs from './pages/AboutUs'


const App = () => {
  return (
    <div>

      <div className="absolute inset-0 -z-10 h-fit w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">


        {/* <Navbar />
        <MainPage />

        <Secondpage/>
        <Footer /> */}

        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="council" element={<Secondpage />}>
          </Route>
          <Route path="events" element={<AllEvents/>}>
          </Route>
          <Route path="aboutus" element={<AboutUs />}>
          </Route>


        </Routes>
        <Footer />



      </div>
    </div>
  )
}

export default App