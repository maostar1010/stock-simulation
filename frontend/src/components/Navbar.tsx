import { Link } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/about", label: "About" },
  { to: "/market", label: "Market" },
  { to: "/leaderboard", label: "Leaderboard" },
];

export default function Navbar() {
  return (
    <nav className="bg-accent text-white w-64 min-h-screen p-4">
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="block py-2 px-4 hover:bg-accent-foreground hover:text-accent rounded transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
