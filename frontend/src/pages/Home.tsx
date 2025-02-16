import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { SignUpForm } from "@/components/SignUpModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <BackgroundBeamsWithCollision>
      <div className="flex flex-col flex-grow items-center justify-center space-y-8 text-text">
        <div className="flex items-center justify-center space-x-10 mt-20">
          <img src={logo} alt="StockEd Logo" className="w-1/4" />
          <div className="flex flex-col w-1/3">
            <h1 className="text-5xl text-center font-extrabold mt-10 mb-2">
              The Perfect Stock Simulation Platform
            </h1>
            <p className="text-xl text-center font-semibold">
              Start your journey to becoming a stock market pro!
            </p>
            <div className="flex flex-row space-x-4 justify-center">
              <button
                className="px-16 py-3 rounded-full text-2xl duration-200 transition-colors bg-accent-foreground text-accent hover:bg-accent hover:text-white font-semibold mt-2"
                onClick={openModal}
              >
                Login
              </button>
              <button className="px-14 py-3 rounded-full text-2xl duration-200 transition-colors bg-accent-foreground text-accent hover:bg-accent hover:text-white font-semibold mt-2">
                <Link to="/leaderboard">Leaderboard</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal with Darkened Background and Smooth Transitions */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Darkened Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black"
              onClick={closeModal} // Clicking the background closes the modal
            />

            {/* Modal Box */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bottom-12 flex items-center justify-center"
            >
              <SignUpForm onClose={closeModal} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </BackgroundBeamsWithCollision>
  );
}
