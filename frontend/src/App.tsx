import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Simulate from "./pages/Simulate";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/simulate" element={<Simulate />} />
            </Routes>
          </main>
          <footer className="bg-accent text-white p-4 text-center">
            <p>&copy; 2023 Stock Market Simulator. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
