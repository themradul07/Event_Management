import { useState } from "react";

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img:"",
    date:"",
    month:"",
    time:"",
    venue:"",
    // privacy: "public",
    medium: "",
    // startDateTime: "",
    // endDateTime: "",
    // duration: "",
    // language: "",
    // maxParticipants: "",
    category: "",
    // terms: "",
    // locationName: "",
    // latitude: "",
    // longitude: "",
    // acceptingRSVPs: true,
  });
 
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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
    <div className="max-w-2xl mx-auto m-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl text-center mx-auto font-semibold mb-4 ">Create Event
        <hr/>
      </h2>
      
      <form  method="post" action={"http://localhost:3000/"}  className="space-y-4">
        <label className="">Title</label>
        <input type="text" name="title" required className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        
        <label className="">Description</label>
        <textarea name="description" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        
        <label className="">Image</label>
        <input name="img" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        
        <label className="">Date</label>
        <input name="date" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        
        <label className="">Month</label>
        <input name="month" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        
        <label className="">Venue</label>
        <input name="venue" required className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        
        {/* <label className="">Privacy</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 ">
            <input type="radio" name="privacy" value="public" checked={formData.privacy === "public"} onChange={handleChange} className="text-purple-600" />
            <span>Public</span>
          </label>
          <label className="flex items-center space-x-2 ">
            <input type="radio" name="privacy" value="private" checked={formData.privacy === "private"} onChange={handleChange} className="text-purple-600" />
            <span>Private</span>
          </label>
        </div> */}

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
{/* 
        <label className="">Start Date</label>
        <input type="datetime-local" name="date" required className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} /> */}
        
        {/* <label className="">End Date-Time</label>
        <input type="datetime-local" name="endDateTime" required className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} /> */}

        <label className="">Time (hh:mm)</label>
        <input type="text" name="time" className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        
        {/* <label className="">Language</label>
        <input type="text" name="language" className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} /> */}
        
        {/* <label className="">Max Participants</label>
        <input type="number" name="maxParticipants" className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} /> */}

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
          <option value="The Drone Learner's Club">The Drone Learner's Club</option>
          {/* <option value="Charity">Charity</option>
          <option value="Fashion">Fashion</option>
          <option value="Kids">Kids</option>
          <option value="Other">Other</option> */}
        </select>

        {/* <label className="">Terms and Conditions</label>
        <textarea name="terms" className="resize-none w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        
        <label className="">Location Name</label>
        <input type="text" name="locationName" required className="w-full p-2 border  rounded focus:ring focus:ring-purple-400" onChange={handleChange} />
        

        <label className="flex items-center space-x-2 ">
          <input type="checkbox" name="acceptingRSVPs" checked={formData.acceptingRSVPs} onChange={handleChange} className="text-purple-600" />
          <span>Accepting RSVPs</span>
        </label> */}

        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Create Event</button>
      </form>
    </div>
  );
}
