import { useState, useEffect } from "react";

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img: "",
    date: "",
    month: "",
    time: "",
    venue: "",
    medium: "",
    category: "",
    isPaid: "",
    amount:"",
  });

  const [isPaid, setIsPaid] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const [minDate, setMinDate] = useState("");

  useEffect(() => {

    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
    console.log(today.split('-')[2]);
  }, []);




  return (
    <>
      <div className='h-[20vh] px-8 text-3xl font-light text-center  flex justify-center items-center text-white overflow-hidden bg-gradient-to-r from-purple-400 to-purple-400'>

        Creatiing the best Events for Bietians !!

      </div>
      <div className="max-w-2xl mx-auto m-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl text-center mx-auto font-semibold mb-4 ">Create Event
          <hr />
        </h2>

        <form method="post" 
        // action={"https://eventmanagementdevloop.netlify.app/create/event"} 
        action={"https://event-management-7ifl.onrender.com/create/event"} 
        
        // action={()=>{console.log(formData)}}
        className="space-y-4" encType="multipart/form-data">
          <label className="">Title</label>
          <input type="text" name="title" required className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />

          <label className="">Description</label>
          <textarea name="description" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />

          <label className="">Image</label>
          <input name="img" type="file" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />

          <label className="">Date</label>
          <input name="date" type="date" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} min={minDate} />

          <label className="">Venue</label>
          <input name="venue" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />



          <label className="">Medium</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 ">
              <input type="radio" name="medium" value="online" checked={formData.medium === "online"} onChange={handleChange} className="text-purple-600" />
              <span>Online</span>
            </label>
            <label className="flex items-center space-x-2 ">
              <input type="radio" name="medium" value="offline" checked={formData.medium === "offline"} onChange={handleChange} className="text-purple-600" />
              <span>Offline</span>
            </label>
            <label className="flex items-center space-x-2 ">
              <input type="radio" name="medium" value="hybrid" checked={formData.medium === "hybrid"} onChange={handleChange} className="text-purple-600" />
              <span>Hybrid</span>
            </label>
          </div>


          <label className="">Time (hh:mm)</label>
          <input type="time" name="time" className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />


          <label className="">Category</label>
          <select name="category" className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Literary">Literary</option>
            <option value="photography">Photography</option>
            <option value="sports">Sports</option>
            <option value="yoga">Yoga</option>
            <option value="hobbies">Hobbies</option>
            <option value="cultural">Cultural</option>
            <option value="Fine Arts">Fine Arts</option>
            <option value="tpc">TPC</option>
            <option value="alumni">Alumni Association</option>
            <option value="mmc">Mercenery Motorsports</option>
            <option value="tdl">The Drone Learners Club</option>
            <option value="iic">IIC</option>

          </select>
          
          <div className='flex max-w-[80vw] w-fit gap-2 items-center justify-center h-[40px]'>

            <input onChange={handleChange}
              onClick={() => {

                setIsPaid(!isPaid);
              }}
              type="checkbox"
              name="isPaid"
              value={true}



            />
            <label className="block font-medium text-gray-700 mb-1" htmlFor="isAdmin">
              Is Paid?
            </label>
          </div>
          {isPaid &&
            <input onChange={handleChange}

              type="number"
              name="amount"
              placeholder='Enter the amount'



              className="w-full max-w-[80vw] border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />}

          <button type="submit" onSubmit={() => { console.log(formData) }} className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Create Event</button>
        </form>
      </div>
    </>
  );
}
