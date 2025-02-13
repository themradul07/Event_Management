import React from 'react'
import Navbar from './components/Navbar'
import MainPage from './components/MainPage'
import './App.css'
const App = () => {
  return (
    <div>
      <div class="absolute inset-0 -z-10 h-fit w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <Navbar />

        


      <MainPage/>
      
      </div>
    </div>
  )
}

export default App