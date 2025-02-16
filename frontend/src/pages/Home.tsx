import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <img src={logo} alt="StockEd Logo" className="w-1/2" />
      <h1 className="text-4xl font-bold text-center">StockEd</h1>
      <p className="text-xl text-center max-w-2xl">
        Learn and practice stock trading in a fun, gamified environment. Start
        your journey to becoming a stock market pro!
      </p>
      <div className="card p-8 text-center ">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <div className="flex flex-row space-x-4 justify-center">
          <Link 
            to="/account" 
            className="btn btn-primary transition-colors"
          >
            Account
          </Link>
          <Link 
            to="/leaderboard" 
            className="btn btn-primary transition-colors">
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
