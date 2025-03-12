import React from 'react'

import Background from '../components/ui/Background'
import { InfiniteSlider } from '../components/ui/Infinitesliding'
import Card from '../components/ui/Card'
import { CarouselCard } from '../components/ui/CarouselCard'
import EventCard from '../components/EventCard'
import { Link } from 'react-router-dom'

const Councilpage = ({ title, desc }) => {
    return (
        <div>


            {/* Background */}
            <Background bgfrom={"from-pink-500"} bgto={"to-purple-400"}  >
                <div className=' text-4xl   max-w-[80vw] md:max-w-[800px] md:text-7xl'>{title}</div>
                <div className='max-w-[80vw] md:max-w-[550px]  text-sm md:text-lg text-center'>The Council of Student Activity enhances campus life by organizing events, fostering leadership, and encouraging student engagement. It provides a platform for creativity, collaboration, and personal growth, ensuring a dynamic and inclusive college experience.</div>



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
                <InfiniteSlider photos={["./lscLogo.jpg", "pfaLogo.jpg", "sportLogo.jpg", "cscLogo.jpg"]} />

            </div>

            {/* Our Subcouncil */}
            <div className='w-full h-fit flex flex-col gap-5 items-center mt-5 mb-5'>
                <div className='font-semibold text-3xl mt-12'>
                    OUR SUBCOUNCIL
                </div>

                <div className='flex mt-8 gap-8 flex-wrap justify-center items-center gap-y-12  '>
                    <a href='/council/lit'>
                        <Card title={"Literary Subcouncil "} image={"./litsub.jpeg"} />
                    </a>

                    <a href='/council/cultural'>
                        <Card title={"Cultural Subcoucil"} image={"./council.jpg"} />
                    </a>
                    <a href='/council/sports'>
                        <Card title={"Sports Subcouncil"} image={"./spsub.png"} />
                    </a>
                    <a href='/council/photography'>
                        <Card title={"Photography and Fine Arts Subcouncil"} image={"./11.png"} />
                    </a>
                    <a href='/council/yoga'>
                        <Card title={"Yoga Subcouncil"} image={"./yogasub.png"} />
                    </a>
                    <a href='/council/hobbies'>
                        <Card title={"Hobbies Subcouncil"} image={"./hobbysub.png"} />
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
                        <CarouselCard images={["Slider2.jpg", "Slider3.jpg", "Slider1.png"]} />
                    </div>

                </div>



            </div>

            {/* President of csa */}
            {/* <div className='w-full h-fit flex flex-col gap-12 items-center mt-5 mb-5 min-h-[90vh]'>
                <div className='font-semibold text-3xl mt-12'>
                    PRESIDENT OF CSA
                </div>

                <div className='rounded-full w-[200px] h-[200px] bg-blue-400'>
                    <img src="./CsaPresident.png" className='w-full h-full rounded-full'  alt="" />

                </div>

                <div className='max-w-[220px] text-center'>
                    President
                </div>


                    
                
            </div> */}
            {/* <EventCard date={10} type={'Event'} month={'AUG'} title={"dfklsdf fsd fsdf sdf sdf sdf sdffg fgdfgdfgdf fgdggdf"}/> */}






        </div>
    )
}

export default Councilpage