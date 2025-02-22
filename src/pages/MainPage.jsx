import React from 'react'
import Testimonial2 from '../components/Testimonial2'
import Questions from '../components/Question'
import Footer from '../components/Footer'
import Background from '../components/ui/background'
import { Link } from 'react-router-dom'

const MainPage = () => {
    return (
        <div className='max-w-[100vw] overflow-hidden'>

            <Background bgfrom={"from-violet-500"} bgto={"to-purple-400"}>
                <div className='text-7xl font-bold text-white tracking-widest'>BIET<span className='font-light'>HUB</span></div>
                <div className='max-w-[550px] text-center text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam labore reprehenderit architecto a nostrum. Est magni quas dolor ex quos veniam quae inventore.</div>

                <Link to='events' className=' z-10 px-4 py-2 border-2 cursor-pointer rounded-full text-white'>
                    <div className='flex gap-3'>
                        Explore Events
                        {/* <button className='px-4 py-2 border-2 rounded-full text-white'>
              SIGN IN
              </button> */}

                    </div>
                </Link>

            </Background>


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
            <div className='h-[1px] bg-black w-full'></div>



            {/* page2 - upcoming events */}
            <div className='w-full h-fit flex flex-col gap-5 items-center mt-5 mb-5'>
                <div className='font-semibold text-3xl mt-12'>
                    UPCOMING EVENTS
                </div>
                <div className='max-w-[450px] font-light text-center'>
                    Lorem ipsum dolor consectetur adipisicing elit. Labore deserunt quaerat possimus dolor non doloribus, rem ipsum. Non!
                </div>


                <div className='flex mt-8 gap-8  '>

                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./event.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            EVENTS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>

                        </div>

                    </div>
                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./event.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            EVENTS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>

                        </div>

                    </div>
                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./event.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            EVENTS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>

                        </div>

                    </div>


                </div>
            </div>


            {/* page3  -  our events */}
            <div className='w-full h-fit  flex flex-col gap-5 items-center mt-5 mb-5'>
                <div className='font-semibold text-3xl mt-12'>
                    OUR EVENTS
                </div>
                <div className='max-w-[450px] font-light text-center'>
                    Lorem ipsum dolor consectetur adipisicing deserunt quaerat possimus dolor non doloribus, rem ipsum. Non!
                </div>


                <div className='flex mt-8 gap-8 '>

                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./white-tree.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            EVENTS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>

                        </div>

                    </div>
                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./events-ele.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            EVENTS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>

                        </div>

                    </div>
                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./event.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            EVENTS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>

                        </div>

                    </div>


                </div>
            </div>
            {/* page3  - modified our council */}
            <div className='w-full h-fit  flex flex-col gap-5 items-center mt-5 mb-5'>
                <div className='font-semibold text-3xl mt-12'>
                    OUR COUNCILS
                </div>
                <div className='max-w-[450px] font-light text-center'>
                    Lorem ipsum dolor consectetur adipisicing deserunt quaerat possimus dolor non doloribus, rem ipsum. Non!
                </div>


                <div className='flex mt-8 gap-8 '>

                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./white-tree.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            Cultural SubCouncil
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>
                            <img src="" alt="" />
                        </div>

                    </div>
                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./events-ele.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            EVENTS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>

                        </div>

                    </div>
                    <div className='relative  w-[300px] border  h-[400px] rounded-md flex flex-col gap-4 items-center' >
                        <div className='flex w-full justify-center items-center'>
                            <img src="./event.png" alt="" className='absolute -top-10 text-center ' />
                        </div>

                        <div className='text-xl font-bold mt-6 '>
                            EVENTS
                        </div>
                        <div className='text-sm font-light text-center '>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
                        </div>

                        <div className='min-h-[60%] min-w-[95%] bg-green-300'>

                        </div>

                    </div>


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