import React from 'react'
import Testimonial2 from '../components/Testimonial2'
import Questions from '../components/Question'
import Footer from '../components/Footer'
import Background from '../components/ui/background'
import { Link } from 'react-router-dom'

const MainPage = () => {
    return (
        <div className='max-w-full'>
            <div className='relative overflow-x-hidden'>
                <Background bgfrom='from-violet-500' bgto='to-purple-400'>
                    <div className='text-6xl md:text-9xl font-bold tracking-wide text-center'>BIET HUB</div>
                    <div className='max-w-[750px] text-center px-4 md:px-0'>
                        BIET HUB is an interactive and engaging platform designed to bring together students, clubs, and committees under one unified digital space. It serves as a central hub for discovering events, participating in student-driven initiatives, and fostering a collaborative environment.
                    </div>
                </Background>
            </div>

            {/* Page 3 - Modified Our Council */}
            <div className='z-10 w-full flex flex-col gap-5 items-center mt-5 mb-5 relative px-4'>
                <div className='absolute -top-36 mx-auto z-10 h-full hidden md:block'>
                    <img className='w-[220px]' src='./illustration.png' alt='' />
                </div>
                <div className='font-semibold text-3xl mt-12 text-center'>OUR COMMITTEES</div>
                <div className='max-w-[450px] font-light text-center'>
                    To ensure smooth event execution and maximum engagement, our structure consists of Councils, Clubs, and Cells, each playing a vital role in fostering creativity, innovation, and efficient event management.
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 relative w-full max-w-6xl'>
                    {[
                        { title: 'CLUBS', description: 'Clubs provide students with a creative and recreational outlet to explore and develop their skills in specialized areas.', imgSrc: './club.jpg' , to : "/clubs" },
                        { title: 'COUNCILS', description: 'Councils oversee and organize large-scale events across various categories, ensuring seamless coordination and leadership.', imgSrc: './council.jpg', to: "/council" },
                        { title: 'CELLS', description: 'Cells focus on key operational areas, ensuring that events are well-organized and efficiently executed.', imgSrc: './cell.jpg' , to:"/cells" }
                    ].map((item, index) => (
                            <a href={item.to}>
                        <div key={index} className='relative z-10 bg-pink-50 border p-4 h-[480px] rounded-md flex flex-col gap-4 items-center text-center'>
                            <div className='flex w-full justify-center items-center'>
                                <img src='./white-tree.png' alt='' className='absolute -top-10 hidden md:block' />
                            </div>
                            <div className='text-xl font-bold mt-6'>{item.title}</div>
                            <div className='text-sm font-light'>{item.description}</div>
                            <div className='min-h-[60%] w-full bg-green-300'>
                                <img className='w-full h-full object-cover' src={item.imgSrc} alt='' />
                            </div>
                        </div>
                            </a>
                    ))}
                </div>
                
                <img src='./gradient.png' className='absolute bottom-0 w-full h-full' alt='' />
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