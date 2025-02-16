"use client";
import UserCard from "../components/UserCard";

const leaderboardData = [
  {
    id: 1,
    username: "TradingPro",
    netGain: 156.7,
    portfolioValue: 25678,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: 2,
    username: "StockMaster",
    netGain: 89.4,
    portfolioValue: 18934,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: 3,
    username: "InvestorGuru",
    netGain: 67.2,
    portfolioValue: 16789,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 4,
    username: "MarketWhiz",
    netGain: 45.8,
    portfolioValue: 14567,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: 5,
    username: "BullBear",
    netGain: -12.3,
    portfolioValue: 8901,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
  {
    id: 6,
    username: "StockNewbie",
    netGain: -23.7,
    portfolioValue: 7654,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
  },
  {
    id: 7,
    username: "TradeRunner",
    netGain: -34.5,
    portfolioValue: 6543,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: 8,
    username: "MarketLearner",
    netGain: -45.6,
    portfolioValue: 5432,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
];

export default function Leaderboard() {
  return (
    <div className="flex justify-center p-8">
      <div className="container mx-auto px-4 py-8 bg-accent-foreground rounded-3xl max-w-5xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Leaderboard</h1>
          <p className="text-xl text-center text-gray-600">
            Top 8 Traders by Net Gain/Loss
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {leaderboardData.map((user, index) => (
            <UserCard
              key={user.id}
              rank={index + 1}
              username={user.username}
              netGain={user.netGain}
              portfolioValue={user.portfolioValue}
              profileImage={user.profileImage}
            />
          ))}
        </div>
      </div>
      //{" "}
    </div>
  );
}
