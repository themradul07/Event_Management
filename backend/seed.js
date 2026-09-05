require('dotenv').config();
const mongoose = require('mongoose');
const EventModel = require('./models/Event');
const connectDB = require('./config/db');

const eventsData = [
    {
        title: "CodeCraft Hackathon",
        description: "An intensive 24-hour hackathon to solve real-world problems. Team up and build innovative web/mobile applications. Mentoring from top developers.",
        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "tpc",
        month: "SEP",
        date: new Date("2026-09-10T09:00:00Z"),
        time: "09:00",
        medium: "hybrid",
        venue: "CS Seminar Hall",
        isExclusive: false
    },
    {
        title: "AI & Robotics Workshop",
        description: "Hands-on workshop on building autonomous line followers and obstacle avoidance robots using Arduino. Components will be provided.",
        img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 150,
        category: "tdl",
        month: "SEP",
        date: new Date("2026-09-15T10:00:00Z"),
        time: "10:00",
        medium: "offline",
        venue: "Robotics Lab",
        isExclusive: true
    },
    {
        title: "Paint & Express Art Show",
        description: "Express your emotions on canvas. A themed canvas painting session for students. Paints, brushes, and canvas sheets are provided for free.",
        img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "Fine Arts",
        month: "SEP",
        date: new Date("2026-09-18T14:00:00Z"),
        time: "14:00",
        medium: "offline",
        venue: "Art Room",
        isExclusive: false
    },
    {
        title: "Street Photography Hunt",
        description: "Capture the raw essence of campus life. Quick tips workshop followed by a 2-hour photo scavenger hunt across the campus grounds.",
        img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 99,
        category: "photography",
        month: "SEP",
        date: new Date("2026-09-22T08:00:00Z"),
        time: "08:00",
        medium: "offline",
        venue: "Campus Grounds",
        isExclusive: false
    },
    {
        title: "Annual Debate Championship",
        description: "Speak up, convince, and win. Compete with the best debaters in the college on trending socio-technical topics. Exciting cash prizes.",
        img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "Literary",
        month: "SEP",
        date: new Date("2026-09-25T11:00:00Z"),
        time: "11:00",
        medium: "offline",
        venue: "Main Auditorium",
        isExclusive: false
    },
    {
        title: "Spandan Cultural Night",
        description: "A magical night of dance, music, drama, and fashion. Featuring live performances from college bands and dancers. Entry passes required.",
        img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 250,
        category: "cultural",
        month: "OCT",
        date: new Date("2026-10-02T18:00:00Z"),
        time: "18:00",
        medium: "offline",
        venue: "Open Air Theatre",
        isExclusive: false
    },
    {
        title: "Mindfulness Yoga Session",
        description: "De-stress yourself with guided meditation, stretching, and breathing exercises. Designed for beginners and intermediate practitioners.",
        img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "yoga",
        month: "SEP",
        date: new Date("2026-09-12T06:00:00Z"),
        time: "06:00",
        medium: "online",
        venue: "Zoom Meeting Link",
        isExclusive: false
    },
    {
        title: "Alumni Tech Talk Series",
        description: "Exclusive interactive session with our alumni working in Google, Amazon, and Meta. Get insights on cracking tech interview preparation.",
        img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "alumni",
        month: "SEP",
        date: new Date("2026-09-28T16:00:00Z"),
        time: "16:00",
        medium: "online",
        venue: "Google Meet Link",
        isExclusive: true
    },
    {
        title: "RC Drone Racing League",
        description: "Experience the thrill of high-speed drone navigation. Bring your mini quadcopters or watch experts navigate challenging obstacle courses.",
        img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 199,
        category: "tdl",
        month: "OCT",
        date: new Date("2026-10-05T09:30:00Z"),
        time: "09:30",
        medium: "offline",
        venue: "Sports Complex",
        isExclusive: false
    },
    {
        title: "Startup Pitch Fest",
        description: "Got a business idea? Pitch it to investors, incubators, and business mentors. Top 3 startup pitches will receive seed funding support.",
        img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "iic",
        month: "OCT",
        date: new Date("2026-10-10T10:00:00Z"),
        time: "10:00",
        medium: "hybrid",
        venue: "Seminar Hall 1",
        isExclusive: false
    },
    {
        title: "Motorsports Auto Show",
        description: "Behold the engineering of racing vehicles. Display of Formula SAE race cars, offroad buggies, and custom superbikes designed by students.",
        img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "mmc",
        month: "OCT",
        date: new Date("2026-10-15T11:00:00Z"),
        time: "11:00",
        medium: "offline",
        venue: "Mechanical Workshop Ground",
        isExclusive: true
    },
    {
        title: "Corporate Mock Interviews",
        description: "Simulate real engineering and behavioral interviews with HR professionals. Detailed report cards and feedback will be shared after the mock.",
        img: "https://images.unsplash.com/photo-1521737711867-e3b90473bd58?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 299,
        category: "tpc",
        month: "SEP",
        date: new Date("2026-09-30T13:00:00Z"),
        time: "13:00",
        medium: "online",
        venue: "Webex Platform",
        isExclusive: true
    },
    {
        title: "Vocal & Instrumental Solo",
        description: "Classical and modern vocal and instrumental competition. Show your skill in keyboards, guitars, flutes, or pure vocals.",
        img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "cultural",
        month: "SEP",
        date: new Date("2026-09-29T15:30:00Z"),
        time: "15:30",
        medium: "offline",
        venue: "Music Room",
        isExclusive: false
    },
    {
        title: "Mini Football Tournament",
        description: "5v5 football cup. Maximum 7 players per squad. League format leading up to semi-finals and final. Winners get the golden trophy.",
        img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 120,
        category: "sports",
        month: "OCT",
        date: new Date("2026-10-08T16:00:00Z"),
        time: "16:00",
        medium: "offline",
        venue: "Main Sports Ground",
        isExclusive: false
    },
    {
        title: "Poetry Slam Session",
        description: "Unravel your emotions through verses. Perform your original poems, ghazals, or spoken-word stories in front of a supportive audience.",
        img: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "Literary",
        month: "OCT",
        date: new Date("2026-10-12T17:00:00Z"),
        time: "17:00",
        medium: "offline",
        venue: "SAC Building",
        isExclusive: false
    },
    {
        title: "Sketching & Origami Crafting",
        description: "Learn detailed pencil shading techniques and intricate paper fold patterns. Instructed by state-level origami artist.",
        img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 50,
        category: "Fine Arts",
        month: "OCT",
        date: new Date("2026-10-18T10:00:00Z"),
        time: "10:00",
        medium: "offline",
        venue: "Art Room Annex",
        isExclusive: false
    },
    {
        title: "Clash of LANs: Valorant",
        description: "The ultimate college gaming competition. 5v5 tactical shooter tournament. Brackets will be updated live. Bring your headphones.",
        img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 150,
        category: "hobbies",
        month: "OCT",
        date: new Date("2026-10-22T10:00:00Z"),
        time: "10:00",
        medium: "offline",
        venue: "Computer Center",
        isExclusive: false
    },
    {
        title: "Web Development Bootcamp",
        description: "Complete hands-on masterclass starting from React basics up to building and deploying fullstack MERN projects on AWS/Vercel.",
        img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "tpc",
        month: "SEP",
        date: new Date("2026-09-20T09:30:00Z"),
        time: "09:30",
        medium: "hybrid",
        venue: "CS Lab 3",
        isExclusive: true
    },
    {
        title: "Chess Grandmaster Arena",
        description: "Show off your strategy. Classical/rapid Swiss-system Chess tournament hosted online. Standard FIDE chess rules apply.",
        img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800",
        isPaid: false,
        amount: 0,
        category: "sports",
        month: "OCT",
        date: new Date("2026-10-26T19:00:00Z"),
        time: "19:00",
        medium: "online",
        venue: "Lichess.org platform",
        isExclusive: false
    },
    {
        title: "Product Design Challenge",
        description: "3D CAD modeling and rapid prototyping hackathon. Bring your designs to life using college 3D printers and CNC machines.",
        img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
        isPaid: true,
        amount: 100,
        category: "iic",
        month: "NOV",
        date: new Date("2026-11-01T09:00:00Z"),
        time: "09:00",
        medium: "hybrid",
        venue: "Incubation Center",
        isExclusive: true
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        
        console.log("Connected to database for seeding.");
        
        // Remove existing events
        await EventModel.deleteMany({});
        console.log("Existing events cleared.");
        
        // Insert new events
        const insertedEvents = await EventModel.insertMany(eventsData);
        console.log(`Successfully seeded ${insertedEvents.length} events!`);
        
        mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
