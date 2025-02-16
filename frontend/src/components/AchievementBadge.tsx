interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  earnedDate?: Date;
  isLocked?: boolean;
}

export default function AchievementBadge({ 
  name, 
  description, 
  icon, 
  earnedDate, 
  isLocked = false 
}: AchievementBadgeProps) {
  return (
    <div className={`bg-white rounded-xl p-4 ${isLocked ? 'opacity-50' : ''}`}>
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center 
          ${isLocked ? 'bg-gray-300' : 'bg-accent'}`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {earnedDate && !isLocked && (
            <p className="text-xs text-accent mt-1">
              Earned on {earnedDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 