import { useState ,useEffect } from "react";

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
  });

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form Submitted", formData);
  //   alert("Form Submitted");


  //   // const handleSubmit = async (e) => {
  //   //   e.preventDefault();

  //   //   try {
  //   //     const response = await fetch("http://localhost:3000/", { // FIXED URL
  //   //       method: "POST",
  //   //       headers: {
  //   //         "Content-Type": "application/json",
  //   //       },
  //   //       body: JSON.stringify(formData),
  // {credentials: "include"}
  //   //     });

  //   //     if (!response.ok) {
  //   //       throw new Error("Failed to submit form");
  //   //     }

  //   //     const result = await response.json();
  //   //     console.log("Form Submitted Successfully", result);
  //   //     alert("Event created successfully!");
  //   //   } catch (error) {
  //   //     console.error("Error submitting form:", error);
  //   //     alert("Failed to create event. Please try again.");
  //   //   }
  //   // };
  //   // handleSubmit(e);
  // }


  return (
    <>
      <div className='h-[20vh] px-8 text-3xl font-light text-center  flex justify-center items-center text-white overflow-hidden bg-gradient-to-r from-purple-400 to-purple-400'>

        Creatiing the best Events for Bietians !!

      </div>
      <div className="max-w-2xl mx-auto m-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl text-center mx-auto font-semibold mb-4 ">Create Event
          <hr />
        </h2>

        <form method="post" action={"http://localhost:3000/"} className="space-y-4" enctype="multipart/form-data">
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
            <option value="Photography">Photography</option>
            <option value="Sports">Sports</option>
            <option value="Fine Arts">Fine Arts</option>
            <option value="Cultural">Cultural</option>
            <option value="TPC">TPC</option>
            <option value="Alumni Association">Alumni Association</option>
            <option value="Mercenery Motorsports">Mercenery Motorsports</option>
            <option value="The Drone Learners Club">The Drone Learners Club</option>
            <option value="IIC">IIC</option>

          </select>


          <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Create Event</button>
        </form>
      </div>
    </>
  );
}
