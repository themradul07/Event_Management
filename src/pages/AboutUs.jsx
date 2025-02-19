import React from 'react'
import Background from '../components/ui/background'

const AboutUs = () => {
  return (
    <div>

        <Background bgfrom={'from-blue-200'} bgto={'to-violet-600'}>

            <div className='text-5xl text-wider font-bold ' >
                About Us
            </div>
            <div className='max-w-[700px]'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque culpa voluptatem quidem necessitatibus fugit blanditiis molestias error animi aliquid nisi magnam dicta ipsam possimus eum dolorum perspiciatis beatae quas nihil, vitae ducimus! Dignissimos, assumenda.
            </div>

        </Background>

    </div>
  )
}

export default AboutUs