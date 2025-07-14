import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leagues from "./pages/Leagues";
import Players from "./pages/Players";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import SurvivorPage from "./pages/Survivor";
import LoveIslandPage from "./pages/LoveIsland";
import BigBrotherPage from "./pages/BigBrother";
import TraitorsPage from "./pages/Traitors";
import LeagueDetails from "./pages/LeagueDetails";
import PublicProfile from "./pages/PublicProfile";
import AuthDebug from "./pages/AuthDebug";

function ShowRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const show = params.get("show");
  if (show === "survivor") return <Navigate to="/survivor" replace />;
  if (show === "loveisland") return <Navigate to="/loveisland" replace />;
  if (show === "bigbrother") return <Navigate to="/bigbrother" replace />;
  if (show === "traitors") return <Navigate to="/traitors" replace />;
  return <Dashboard />;
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ShowRedirect />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/leagues/:id" element={<LeagueDetails />} />
          <Route path="/players" element={<Players />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/survivor" element={<SurvivorPage />} />
          <Route path="/loveisland" element={<LoveIslandPage />} />
          <Route path="/bigbrother" element={<BigBrotherPage />} />
          <Route path="/traitors" element={<TraitorsPage />} />
          <Route path="/users/:userId" element={<PublicProfile />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
