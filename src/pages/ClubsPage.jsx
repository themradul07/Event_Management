import React from 'react'
import Background from '../components/ui/Background'
import { InfiniteSlider } from '../components/ui/Infinitesliding'
import Card from '../components/ui/Card'
import { CarouselCard } from '../components/ui/CarouselCard'
import EventCard from '../components/EventCard'
import { Link } from 'react-router-dom'

const Clubspage = ({title , desc}) => {
    return (
        <div className='max-w-[100vw]'>


            {/* Background */}
            <Background bgfrom={"from-pink-500"} bgto={"to-purple-400"}  >
            <div className=' text-4xl   max-w-[80vw] md:max-w-[800px] md:text-7xl'>{title}</div>
                <div className='max-w-[80vw] md:max-w-[550px]  text-sm md:text-lg text-center'>BIET Clubs is an initiative at Bundelkhand Institute of Engineering and Technology (BIET) that fosters innovation, entrepreneurship, and student-led projects. It provides a platform for students to collaborate, develop skills, and contribute to technological advancements.</div>

                

            </Background>

            {/* Upcoming Events */}
            {/* <div className='w-full h-fit flex flex-col gap-5 items-center mt-5 mb-5'>
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
            </div> */}
            
            {/* slider */}
            <div className='p-5'>
            <InfiniteSlider photos ={["MerceneryLogo.jpg", "TdlLogo.jpg"]} />

            </div>

            {/* Our Subcouncil */}
            <div className='w-full h-fit flex flex-col gap-5 items-center mt-5 mb-5'>
                <div className='font-semibold text-3xl mt-12'>
                    OUR CLUBS
                </div>

                <div className='flex mt-8 gap-8 flex-wrap justify-center items-center gap-y-12  '>
                    <a href='/club/tdl'>
                    <Card title={"Team Drone Learners Club"} image={"./TdlLogo.jpg"} />
                    </a>
                    <a href="/club/mmc">
                    <Card title={"Mercenery Motorsports Club"} image={"./MerceneryLogo.jpg"}/>
                    </a>
                    
                    
                    


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

                    <div className='min-w-[55%] w-full  max-h-[400px] object-contain overflow-hidden flex items-center justify-center'>
                        <CarouselCard images={["ClubsSlider1.jpg","ClubsSlider2.jpg","ClubsSlider3.jpg"]}/>
                    </div>

                </div>

                    
                
            </div>

            {/* President of csa */}
           



            


        </div>
    )
}

export default Clubspage