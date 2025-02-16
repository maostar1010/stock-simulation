import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Leaderboard from "./pages/Leaderboard";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col flex-grow">
          <main className="flex-grow px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
