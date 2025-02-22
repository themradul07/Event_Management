import React from 'react'
import Testimonial2 from '../components/Testimonial2'
import Questions from '../components/Question'
import Footer from '../components/Footer'
import Background from '../components/ui/background'
import { Link } from 'react-router-dom'

const MainPage = () => {
    return (
        <div className='max-w-[100vw]'>

<div className='relative overflow-x-hidden'>

            <Background bgfrom={"from-violet-500"} bgto={"to-purple-400"} >

                

                

                    <div className='text-9xl font-bold tracking-wide'>BIET HUB</div>
                    <div className='max-w-[750px] text-cente '>BIET HUB is an interactive and engaging platform designed to bring together students,clubs and committees under one unified digital space.It serves as a central hub for discoverin events,participating in student-driven initiatives and fostering a collaborative environment..</div>

                    
                
                
                

            </Background>
</div>


            {/* main page */}
            {/* <div className='background-box w-full h-[80vh] opacity-75 flex justify-center items-center flex-col gap-10'>
                <div className='text-7xl font-bold text-white'>BIET<span className='font-light'>HUB</span></div>
                <div className='max-w-[550px] text-center text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam labore reprehenderit architecto a nostrum. Est magni quas dolor ex quos veniam quae inventore.</div>
                
                <div className='flex gap-3'>
                <button className='px-4 py-2 border-2 cursor-pointer rounded-full text-white'>
                Explore Events
                </button>
                
                
                </div>
            </div> */}
           




            {/* page3  - modified our council */}
            <div className='z-10 w-full h-fit  flex flex-col gap-5 items-center mt-5 mb-5 relative'>
                <div className='absolute -top-36  mx-auto z-10 h-full  '> 
                    <img className='w-[220px]' src="./illustration.png" alt="" />
                </div>
                <div className='font-semibold text-3xl mt-12'>
                    OUR COMMITTEES
                </div>
                <div className='max-w-[450px] font-light text-center'>
                    To ensure smooth event execution and maximum engagement, our structure consists of Councils, Clubs, and Cells, each playing a vital role in fostering creativity, innovation, and efficient event management.
                </div>


                <div className='flex mt-8 gap-8 relative '>

                    <div className='relative justify-between z-10 bg-pink-50 w-[300px] border p-2  h-[480px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./white-tree.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            CLUBS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Clubs provide students with a creative and recreational outlet to explore and develop their skills in specialized areas.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>
                            <img className='w-full h-full object-fit' src="./club.jpg" alt="" />
                        </div>

                    </div>
                    <div className='relative justify-between z-10 bg-pink-50 w-[300px] border p-2  h-[480px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./white-tree.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            COUNCILS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Councils oversee and organize large-scale events across various categories, ensuring seamless coordination and leadership
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>
                            <img className='w-full h-full object-fit' src="./council.jpg" alt="" />
                        </div>

                    </div>
                    <div className='relative justify-between z-10 bg-pink-50 w-[300px] border p-2  h-[480px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./white-tree.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            CELLS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Cells focus on key operational areas, ensuring that events are well-organized and efficiently executed.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>
                            <img className='w-full h-full object-fit' src="./cell.jpg" alt="" />
                        </div>

                    </div>

                    <img src="./gradient.png" className='absolute bottom-0 w-full h-full' alt="" />




                </div>
            </div>

            {/* page 4 */}
            <div className='min-h-[95vh] h-fit'>

                <Testimonial2 />
            </div>

            {/* faq */}
            <Questions />







        </div>
    )
}

export default MainPage