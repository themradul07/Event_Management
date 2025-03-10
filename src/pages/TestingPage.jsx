import React from 'react'

const TestingPage = () => {
  return (
    <div>
      <img src="https://event-management-7ifl.onrender.com/he.jpg" className='w-fit' alt="" />

      <form action="https://event-management-7ifl.onrender.com/postimage" method='post' enctype="multipart/form-data" >
        <label htmlFor="img">Give the Image</label>
        <input type="file" name="image" />
        <label htmlFor="name">This is my Name</label>
        <input type="text" name='name' />
        <input type="Submit" value={"Submit"} className='p-2 bg-blue-500 text-white' />
      </form>
    </div>
  )
}

export default TestingPage