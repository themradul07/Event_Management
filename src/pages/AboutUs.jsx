import React from 'react'
import Background from '../components/ui/background'

const AboutUs = () => {
  return (
    <div>

      <Background bgfrom={'from-blue-200'} bgto={'to-violet-600'}>

        <div className='text-5xl text-wider font-bold ' >
          About Us
        </div>
        <div className='max-w-[700px] flex flex-col gap-5'>
          <div>

          Welcome to Biet Hub, the ultimate hub for tech-driven events, hackathons, workshops, and cultural fests at Bundelkhand Institute Of Engineering And Technology, Jhansi. We are a dynamic team of students passionate about organizing engaging, innovative, and seamless events that bring the IT community together.
          </div>
          

          <div>


          🚀 Join us and be a part of something extraordinary!

          
         
          </div>
        </div>

      </Background>

    </div>
  )
}

export default AboutUs