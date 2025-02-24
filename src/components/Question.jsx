import React from 'react'

const Questions = () => {
  return (
    <div
    className="relative w-full bg-white px-6 pt-10 pb-8 mt-8 mb-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
    <div className="mx-auto px-5">
        <div className="flex flex-col items-center">
            <h2 className="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">FAQ</h2>
            <p className="mt-3 text-lg text-neutral-500 md:text-xl">Frequenty asked questions

            </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
            <div className="py-5">
                <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                        <span>What is BIET Hub?</span>
                        <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision"
                                    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    BIET Hub is a student-driven platform designed to share resources, updates, and important information related to BIET Jhansi. It helps students collaborate, learn, and stay informed.
                    </p>
                </details>
            </div>
            <div className="py-5">
                <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                        <span> How do I register on By BIET Hub?</span>
                        <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision"
                                    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">To register, sign up using your BIET Jhansi email ID. After signing up, click on the "Explore" button, select the event you’re interested in, and fill in the required details to complete your registration.
                    </p>
                </details>
            </div>
            <div className="py-5">
                <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                        <span> How can I become a committee member of By BIET Hub?</span>
                        <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision"
                                    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">To join, you need to fill out the Detailed Application Form (DAF). Shortlisted candidates will be called for an interview, and based on the performance, selected students will become committee members. Stay tuned for updates!
                    </p>
                </details>
            </div>
            
        </div>
    </div>
</div>

  )
}

export default Questions