import React from 'react'

import Background from '../components/ui/background'
import { InfiniteSlider } from '../components/ui/Infinitesliding'
import Card from '../components/ui/Card'
import { CarouselCard } from '../components/ui/CarouselCard'

const Secondpage = () => {
    return (
        <div>


            {/* Background */}
            <Background bgfrom={"from-pink-500"} bgto={"to-purple-400"} >
                <div className='pin text-7xl font-bold text-white tracking-wide max-w-[800px]'>COUNCIL OF STUDENT ACTIVITY</div>
                <div className='max-w-[550px] text-center text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam labore reprehenderit architecto a nostrum. Est magni quas dolor ex quos veniam quae inventore.</div>

                <div className='flex gap-3'>
                    <button className='px-4 py-2 border-2 cursor-pointer rounded-full text-white'>
                        Explore Events
                    </button>
                    {/* <button className='px-4 py-2 border-2 rounded-full text-white'>
              SIGN IN
            </button> */}

                </div>

            </Background>

            {/* Upcoming Events */}
            <div className='w-full h-fit flex flex-col gap-5 items-center mt-5 mb-5'>
                <div className='font-semibold text-3xl mt-12'>
                    UPCOMING EVENTS
                </div>
                
                <div className='flex mt-8  h-fit justify-center items-center '>

                    <div className='relative bg-pink-200 p-8  w-[700px] h-fit rounded-md flex flex-col gap-4 items-center justify-center' >
                        
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet, ipsum. Perspiciatis, maxime nostrum veritatis ratione nemo incidunt nihil itaque accusamus velit explicabo, magnam ex aut nisi! Amet incidunt, eligendi perspiciatis at magni quidem maiores. Quae.

                    </div>
                    <div className='relative p-2   w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center justify-center' >
                        
                        <div className='min-h-[100%] rounded-md min-w-[100%] bg-violet-300'>

                        </div>

                    </div>
                    


                </div>
            </div>
            
            {/* slider */}
            <div className='p-5'>
            <InfiniteSlider/>

            </div>

            {/* Our Subcouncil */}
            <div className='w-full h-fit flex flex-col gap-5 items-center mt-5 mb-5'>
                <div className='font-semibold text-3xl mt-12'>
                    OUR SUBCOUNCIL
                </div>

                <div className='flex mt-8 gap-8 flex-wrap justify-center items-center gap-y-12  '>

                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>          
                    


                </div>     
                
            </div>

            {/* Glimpse of event */}
            <div className='w-full h-fit flex flex-col gap-5 items-center mt-5 mb-5'>
                <div className='font-semibold text-3xl mt-12'>
                    GLIMPSE OF EVENTS
                </div>

                <div className='min-h-[400px] w-full mt-5 mb-5 flex p-4 justify-between items-center'>

                    {/* <div className='text-center flex items-center justify-center'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt necessitatibus sequi nobis atque veniam doloribus!
                    </div> */}

                    <div className='min-w-[55%] w-full bg-amber-200 max-h-[400px] object-contain overflow-hidden flex items-center justify-center'>
                        <CarouselCard/>
                    </div>

                </div>

                    
                
            </div>

            {/* President of csa */}
            <div className='w-full h-fit flex flex-col gap-12 items-center mt-5 mb-5 min-h-[90vh]'>
                <div className='font-semibold text-3xl mt-12'>
                    PRESIDENT OF CSA
                </div>

                <div className='rounded-full w-[200px] h-[200px] bg-blue-400'>

                </div>

                <div className='max-w-[220px] text-center'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, nemo!
                </div>

                    
                
            </div>



            


        </div>
    )
}

export default Secondpage