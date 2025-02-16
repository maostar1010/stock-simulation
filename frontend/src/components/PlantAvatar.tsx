import { PlantImages } from '../assets/plantStages';

interface PlantStage {
  stage: number;
  name: string;
  image: keyof typeof PlantImages;
  requiredGain: number;
  description: string;
}

const plantStages: PlantStage[] = [
  {
    stage: 0,
    name: "Seed",
    image: "Seed",
    requiredGain: 0,
    description: "Your journey begins! Plant your seed and start trading."
  },
  {
    stage: 1,
    name: "Sprout",
    image: "Sprout",
    requiredGain: 10,
    description: "Your first gains have helped your seed sprout!"
  },
  {
    stage: 2,
    name: "Seedling",
    image: "Seedling",
    requiredGain: 25,
    description: "Growing steadily with your trading success!"
  },
  {
    stage: 3,
    name: "Young Plant",
    image: "YoungPlant",
    requiredGain: 50,
    description: "Your plant is growing stronger with each profitable trade!"
  },
  {
    stage: 4,
    name: "Blooming Plant",
    image: "BloomingPlant",
    requiredGain: 100,
    description: "Your trading expertise is blooming!"
  },
  {
    stage: 5,
    name: "Mature Plant",
    image: "MaturePlant",
    requiredGain: 200,
    description: "You've grown into a mature trader!"
  }
];

interface PlantAvatarProps {
  netGainPercentage: number;
  onGrowth?: (newStage: PlantStage) => void;
}

export default function PlantAvatar({ netGainPercentage, onGrowth }: PlantAvatarProps) {
  // Determine current plant stage based on net gain
  const getCurrentStage = () => {
    return plantStages.reduce((prev, current) => {
      if (netGainPercentage >= current.requiredGain) {
        return current;
      }
      return prev;
    });
  };

  const currentStage = getCurrentStage();
  const nextStage = plantStages[currentStage.stage + 1];
  const progressToNext = nextStage 
    ? ((netGainPercentage - currentStage.requiredGain) / 
       (nextStage.requiredGain - currentStage.requiredGain)) * 100
    : 100;

  return (
    <div className="relative">
      {/* Plant Container */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white">
        {PlantImages[currentStage.image]}
      </div>

      {/* Progress Ring */}
      {nextStage && (
        <div className="absolute inset-0 w-32 h-32">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-accent-foreground opacity-25"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-accent"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - progressToNext / 100)}`}
            />
          </svg>
        </div>
      )}

      {/* Stage Info */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-accent text-white px-3 py-1 rounded-full text-sm">
        {currentStage.name}
      </div>
    </div>
  );
} 