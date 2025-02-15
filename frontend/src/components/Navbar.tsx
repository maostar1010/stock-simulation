import { Link } from "react-router-dom"

const navItems = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Learn" },
  { to: "/simulate", label: "Simulate" },
]

export default function Navbar() {
  return (
    <nav className="bg-accent text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Stock Market Simulator</h1>
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className="block py-2 px-4 hover:bg-accent-foreground rounded transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

