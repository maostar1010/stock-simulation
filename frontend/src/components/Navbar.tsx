import { Link } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/market", label: "Market" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/account", label: "Account" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 p-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-accent p-3 hover:bg-accent-foreground rounded-full transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Combined nav sidebar that starts from top */}
          <nav className="fixed top-0 left-0 h-full bg-accent w-64 transform transition-transform duration-300 ease-in-out z-40">
            <div className="h-16 flex items-center justify-center">
              {/* <h1 className="text-2xl font-bold text-white">StockEd</h1> */}
            </div>

            {/* Navigation links */}
            <ul className="space-y-4 p-4 text-xl font-semibold">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 px-4 text-white hover:bg-accent-foreground hover:text-accent rounded transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsOpen(false)}
          ></div>
        </>
      )}
    </>
  );
}
