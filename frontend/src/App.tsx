import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import LeagueDetails from "./pages/LeagueDetails";
import PublicProfile from "./pages/PublicProfile";
import AuthDebug from "./pages/AuthDebug";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/leagues/:id" element={<LeagueDetails />} />
          <Route path="/players" element={<Players />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/survivor" element={<SurvivorPage />} />
          <Route path="/users/:userId" element={<PublicProfile />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
