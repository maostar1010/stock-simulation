import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { SignUpForm } from "@/components/SignUpModal";
import { useAuth } from "@/components/signup/AuthContext";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  console.log(token);

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <BackgroundBeamsWithCollision>
      <div className="min-h-full w-full flex flex-col items-center justify-center space-y-8 text-text px-4 sm:px-8 -mt-16">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-10">
          {/* Logo */}
          <img
            src={logo}
            alt="StockEd Logo"
            className="w-3/4 sm:w-1/2 md:w-1/4"
          />

          {/* Text Content */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center md:text-left leading-relaxed tracking-wide">
              The Perfect Stock<br />Simulation Platform
            </h1>
            <p className="text-xl sm:text-3xl font-semibold">
              Invest, Trade, Build Your Portfolio with Zero Risk.
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-left mt-4 w-full">
              <button
                className="w-full md:w-auto px-14 py-3 rounded-full text-lg sm:text-xl duration-200 transition-colors bg-accent-foreground text-accent hover:bg-accent hover:text-white font-semibold"
                onClick={() => (token ? navigate("/profile") : openModal())}
              >
                {token ? "Account" : "Sign Up"}
              </button>
              <button className="w-full md:w-[160px] px-6 py-3 rounded-full text-lg sm:text-xl duration-200 transition-colors bg-accent-foreground text-accent hover:bg-accent hover:text-white font-semibold">
                <Link to="/leaderboard">Leaderboard</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal with Darkened Background and Smooth Transitions */}
      <AnimatePresence>
        {isModalOpen && !token && (
          <>
            {/* Darkened Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-[50]"
              onClick={closeModal}
            />

            {/* Modal Box */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bottom-12 flex items-center justify-center p-4 z-[100]"
            >
              <SignUpForm onClose={closeModal} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </BackgroundBeamsWithCollision>
  );
}
