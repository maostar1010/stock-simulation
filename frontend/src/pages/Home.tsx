import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center space-y-8 text-text">
      <div className="flex items-center justify-center space-x-10">
        <img src={logo} alt="StockEd Logo" className="w-1/4" />
        <div className="flex flex-col space-y-2 w-1/3">
          <p className="text-3xl text-center font-extrabold">
            Learn and practice stock trading in a fun, gamified environment.
            Start your journey to becoming a stock market pro!
          </p>
          <div className="flex flex-row space-x-4 justify-center">
            <Link to="/account" className="btn btn-primary transition-colors">
              Account
            </Link>
            <Link
              to="/leaderboard"
              className="btn btn-primary transition-colors"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
