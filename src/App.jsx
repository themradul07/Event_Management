import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import AllEvents from './pages/AllEvents';
import AboutUs from './pages/AboutUs';
import LoginPage from './pages/LoginPage';
import CreateEventForm from './pages/CreateEvent';
import EventPage from './pages/EventPage';
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard';
import LiterarySubCouncil from './pages/LiterarySubCouncil';
import Cellspage from './pages/CellsPage';
import Clubspage from './pages/ClubsPage';
import Councilpage from './pages/Councilpage';
import Policies from './pages/Policies';
import MembershipPage from './pages/MembershipPage';
import AdminSimulator from './pages/AdminSimulator';
import RecoveryDashboard from './pages/RecoveryDashboard';
import PlaybookManager from './pages/PlaybookManager';
import PhoneSimulator from './pages/PhoneSimulator';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

const App = () => {
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname === '/login' || location.pathname.startsWith('/admin') || location.pathname === '/create' || location.pathname === '/phone';

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbarAndFooter && <Navbar />}

      <Routes>
        {/* Main Public Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/phone" element={<PhoneSimulator />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateEventForm />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin/simulator" element={<AdminSimulator />} />
          <Route path="/admin/dashboard" element={<RecoveryDashboard />} />
          <Route path="/admin/playbooks" element={<PlaybookManager />} />
        </Route>

        {/* Category Routes */}
        <Route path="/council" element={<Councilpage title={"COUNCIL OF STUDENT ACTIVITY"} />} />
        <Route path="/cells" element={<Cellspage title={"BIET CELLS"} />} />
        <Route path="/clubs" element={<Clubspage title={"BIET CLUBS"} />} />
        <Route path="/events" element={<AllEvents />} />

        {/* Sub-Council Routes */}
        <Route path="/council/lit" element={<LiterarySubCouncil q={"Literary"} />} />
        <Route path="/council/cultural" element={<LiterarySubCouncil q={"cultural"} />} />
        <Route path="/council/sports" element={<LiterarySubCouncil q={"sports"} />} />
        <Route path="/council/photography" element={<LiterarySubCouncil q={"photography"} />} />
        <Route path="/council/yoga" element={<LiterarySubCouncil q={"yoga"} />} />
        <Route path="/council/hobbies" element={<LiterarySubCouncil q={"hobbies"} />} />

        {/* Club Routes */}
        <Route path="/club/tdl" element={<LiterarySubCouncil q={"tdl"} />} />
        <Route path="/club/mmc" element={<LiterarySubCouncil q={"mmc"} />} />

        {/* Cell Routes */}
        <Route path="/cells/iic" element={<LiterarySubCouncil q={"iic"} />} />
        <Route path="/cells/tpc" element={<LiterarySubCouncil q={"tpc"} />} />
        <Route path="/cells/alumni" element={<LiterarySubCouncil q={"alumni"} />} />

        {/* Policy & Information Routes */}
        <Route path="/refund" element={<Policies q={"refund"} />} />
        <Route path="/privacy" element={<Policies q={"privacy"} />} />
        <Route path="/terms" element={<Policies q={"terms"} />} />
        <Route path="/contactus" element={<AboutUs />} />

        {/* Event Detail Routes */}
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/events/:id" element={<EventPage />} />
        {/* Support direct /:id (e.g. legacy/bookmark links like /Product%20Design%20Challenge) */}
        <Route path="/:id" element={<EventPage />} />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideNavbarAndFooter && <Footer />}
      <ToastContainer
        position="bottom-right"
        theme="light"
        toastStyle={{ backgroundColor: "white", color: "black" }}
        progressStyle={{ background: "purple" }}
      />
    </>
  );
};

export default App;
