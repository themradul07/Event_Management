import React from "react";

const LiterarySubCouncil = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white">
      {/* Navbar */}
     

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 p-6 rounded-lg shadow-lg"
              style={{
                fontFamily: "'Bricolage Grotesque'",
                backgroundImage:
                  "linear-gradient(rgba(147, 51, 234, 0.7), rgba(168, 85, 247, 0.7)), url('/images/background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}>
              LITERARY SUB COUNCIL
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 italic max-w-3xl mx-auto" style={{ fontFamily: "'Inria Serif'" }}>
              Fostering creativity, promoting literary excellence, and building a community of passionate writers and readers.
            </p>
            <img src="/1lit.jpeg"  className="w-full min-h-90 h-fit object-fit rounded-lg mt-12 shadow-xl" />
          </div>
        </section>

        {/* Major Events */}
        <section className="px-6 py-20 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Major Events</h2>
            <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-xl p-6">
                <img src="/2lit.jpeg" alt="Magnum Opus" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">MAGNUM OPUS 2024 - Our Annual Literary Fest</h3>
                <p className="text-gray-600 mb-4">
                  Our flagship literary extravaganza witnessed prestigious competitions, engaging workshops, panel discussions, and renowned speakers from across the country.
                </p>
                <span className="text-sm font-medium text-custom flex items-center justify-center gap-2">15-17 March, 2024</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {["3lit.jpg", "4lit.jpg", "5lit.jpg"].map((image, index) => (
                  <img key={index} src={`/${image}`} alt="Event Glimpse" className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { name: "Ekta Pandey", role: "Officer-In Charge", img: "ek.jpeg" },
                { name: "Abhishek Pratap Singh (ECE)", role: "Secretary", img: "ab.jpg" },
                { name: "Anushka Jaiswal (CSE)", role: "Secretary", img: "an.jpg" },
                { name: "Abhishek Kr. Dixit (IT)", role: "Joint Secretary", img: "abd.jpg" },
                { name: "Palak Verma", role: "Joint Secretary", img: "pv.jpg" },
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-xl p-6 text-center">
                  <img src={`/${member.img}`} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    
    </div>
  );
};

export default LiterarySubCouncil;
