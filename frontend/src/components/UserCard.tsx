interface UserCardProps {
  rank: number;
  username: string;
  netGain: number;
  balance: number;
  portfolioValue: number;
  profileImage: string;
}

export default function UserCard({ 
  rank, 
  username, 
  netGain = 0, // Default value
  balance = 0, // Default value
  portfolioValue = 0, // Default value
  profileImage 
}: UserCardProps) {
  
  // Safe number formatting with fallback
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || isNaN(num)) return '$0.00';
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
        {rank}
      </div>
      
      <img
        src={profileImage || 'default-avatar.png'} // Fallback image
        alt={`${username}'s avatar`}
        className="w-12 h-12 rounded-full"
      />
      
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">{username}</h3>
        <div className="text-sm text-gray-600">
          Portfolio Value: {formatNumber(portfolioValue)}
        </div>
      </div>
      
      <div className={`text-lg font-semibold ${netGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {formatNumber(balance)}
      </div>
    </div>
  );
}
