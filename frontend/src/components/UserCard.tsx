interface UserCardProps {
  rank: number;
  username: string;
  netGain: number;
  portfolioValue: number;
  profileImage?: string;
}

export default function UserCard({ rank, username, netGain, portfolioValue, profileImage }: UserCardProps) {
  const isProfit = netGain >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        {/* Rank Circle */}
        <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold">#{rank}</span>
        </div>

        {/* Profile Image */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
          <img 
            src={profileImage || '/default-avatar.png'} 
            alt={username}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-grow">
          <h3 className="text-xl font-semibold">{username}</h3>
          <p className="text-gray-600">Portfolio: ${portfolioValue.toLocaleString()}</p>
        </div>

        {/* Net Gain/Loss */}
        <div className={`flex-shrink-0 text-right ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
          <p className="text-xl font-bold">
            {isProfit ? '+' : ''}{netGain.toLocaleString()}%
          </p>
        </div>
      </div>
    </div>
  );
}
