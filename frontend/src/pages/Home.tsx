import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <img src={logo} alt="StockEd Logo" className="w-1/2" />
      <h1 className="text-4xl font-bold text-center space-y-6">Welcome to </h1>
      <h1 className="text-4xl font-bold text-center space-y-6 text-accent-green">StockEd</h1>
      <h2 className="font-medium text-center">Your <b>interactive</b> and <b>risk-free</b> <section className="text-4xl font-semibold space-y-6 text-accent-green">stock market simulator!</section></h2>
      <p className="text-2xl text-center max-w-2xl">
        
Welcome to StockEd—your interactive and risk-free stock market simulator!

StockEd is designed to help young adults and beginners learn about the stock market by providing a realistic, hands-on trading experience without any financial risk. With live market values, you can practice buying and selling stocks just like in the real world, all while competing on our leaderboard to see how your portfolio stacks up against others.
      </p>
      <div className="card p-8 text-center ">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <p className="text-xl text-center max-w-2xl mb-6">Learn and practice stock trading in a fun, gamified environment. <br />Start
        your journey to becoming a stock market pro!</p>
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
