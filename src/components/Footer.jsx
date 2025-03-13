import React from 'react'

const Footer = () => {
  return (
    <div className='w-full p-5 min-h-[250px] text-white flex flex-col gap-2 justify-center items-center bg-black'>
      <div className='max-w-[90vw] flex flex-col gap-6 justify-center items-center text-center'
      >

        <div >
          Copyright@BIETHUB 2025

        </div>
        <div className='font-light text-sm text-gray-300'>

          The website does not have any refund or cancellation policy.
        </div>
        <div className='justify-self-start text-sm'>
          <ul className='flex flex-col md:flex-row gap-4 font-light text-gray-500'>
            <a href="/privacy">
              <li>Privacy Policy</li>
            </a>
            <a href="/refund">
              <li>Refund and Cacellation Policy</li>
            </a>
            <a href="/terms">
              <li>Terms And Conditions</li>
            </a>
            <a href="/contactus">
              <li>Contact Us</li>
            </a>
          </ul>
        </div>
      </div>

    </div>
  )
}

export default Footer