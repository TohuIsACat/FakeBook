import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  // to check it's login or not
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={currentUser ? <Home /> : <Login />} />
          <Route
            path="/profile/:username"
            element={currentUser ? <Profile /> : <Home />}
          />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/messenger"
            element={currentUser ? <Messenger /> : <Navigate to="/" />}
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
