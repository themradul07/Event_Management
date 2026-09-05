import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL } from "../utils/api";
import { 
    Calendar, 
    MapPin, 
    Clock, 
    PlusCircle,
    Info
} from "lucide-react";

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
    amount: "",
    isExclusive: false,
  });

  const [isPaid, setIsPaid] = useState(false);

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
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8 text-left">
        {/* Header Information Banner */}
        <div className="text-left space-y-3 relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-700">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            Publish Utility
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
            Create Student Event
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-3xl">
            Design and publish student activity events, assign tags, configure gating rules, and setup paid ticket parameters.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-slate-200/80">
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-150 pb-3">
              <PlusCircle className="h-5 w-5 text-purple-600" />
              <span>Event Details Form</span>
            </h2>

            <form 
              method="post"
              action={`${API_BASE_URL}/create/event`}
              className="space-y-5 text-xs font-semibold text-slate-600" 
              encType="multipart/form-data"
            >
              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wide">Event Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-xs" 
                  placeholder="e.g. Annual Technical Fest 2026"
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wide">Event Description</label>
                <textarea 
                  name="description" 
                  required 
                  className="resize-none w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:outline-none focus:border-purple-500 focus:bg-white transition-all h-28 text-xs" 
                  placeholder="Provide brief details about the event context, timeline, rules..."
                  onChange={handleChange} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide">Event Image Banner</label>
                  <input 
                    name="img" 
                    type="file" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-500 focus:outline-none focus:border-purple-500 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-purple-50 file:text-purple-750 hover:file:bg-purple-100 transition-all text-xs" 
                    onChange={handleChange} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide">Venue Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={13} />
                    </div>
                    <input 
                      name="venue" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-850 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-xs font-semibold" 
                      placeholder="e.g. Auditorium Hall B"
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide">Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar size={13} />
                    </div>
                    <input 
                      name="date" 
                      type="date" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-850 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-xs font-semibold" 
                      onChange={handleChange} 
                      min={minDate} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide">Time (hh:mm)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Clock size={13} />
                    </div>
                    <input 
                      type="time" 
                      name="time" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-850 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-xs font-semibold" 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold uppercase tracking-wide">Category</label>
                  <select 
                    name="category" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-xs font-semibold" 
                    onChange={handleChange}
                  >
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
                    <option value="iic">IIC</option>
                    <option value="tdl">The Drone Learners Club</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-500 font-bold uppercase tracking-wide">Event Medium</label>
                <div className="flex gap-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {["online", "offline", "hybrid"].map((med) => (
                    <label key={med} className="flex items-center space-x-2 cursor-pointer text-slate-700 hover:text-slate-900 capitalize font-semibold">
                      <input 
                        type="radio" 
                        name="medium" 
                        value={med} 
                        checked={formData.medium === med} 
                        onChange={handleChange} 
                        className="text-purple-600 focus:ring-purple-500 bg-white border-slate-350 h-4 w-4" 
                      />
                      <span>{med}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-150 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input 
                      onChange={handleChange}
                      onClick={() => setIsPaid(!isPaid)}
                      type="checkbox"
                      name="isPaid"
                      checked={isPaid}
                      className="rounded bg-white border-slate-300 text-purple-600 focus:ring-purple-500 h-4.5 w-4.5 cursor-pointer"
                    />
                    <label className="block font-bold text-slate-500 uppercase tracking-wide cursor-pointer" htmlFor="isPaid">
                      Is Paid Event?
                    </label>
                  </div>
                  
                  {isPaid && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <span>₹</span>
                      </div>
                      <input 
                        onChange={handleChange}
                        type="number"
                        name="amount"
                        placeholder="Enter the registration fee"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-800 font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-xs" 
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 h-fit">
                    <input 
                      onChange={handleChange}
                      type="checkbox"
                      name="isExclusive"
                      checked={formData.isExclusive || false}
                      className="rounded bg-white border-slate-300 text-purple-600 focus:ring-purple-500 h-4.5 w-4.5 cursor-pointer"
                    />
                    <label className="block font-bold text-slate-500 uppercase tracking-wide cursor-pointer" htmlFor="isExclusive">
                      Is Exclusive (Members Only)?
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-start gap-1 leading-snug font-medium">
                    <Info size={12} className="shrink-0 text-slate-450 mt-0.5" />
                    <span>Exclusive events restrict registration to students with an active Premium membership card subscription.</span>
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] focus:outline-none mt-2 text-xs"
              >
                Create Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
