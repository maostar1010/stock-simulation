import { useState } from "react";
import PlantAvatar from "../components/PlantAvatar";
import { useAuth } from "@/components/signup/AuthContext";

interface ProfileData {
  username: string;
  memberSince: Date;
  totalNetValue: number;
  cashValue: number;
  marketValue: number;
  netGainPercentage: number;
}

// Example data
const profileData: ProfileData = {
  username: "TradingPro",
  memberSince: new Date("2024-01-15"),
  totalNetValue: 25678.45,
  cashValue: 10000.0,
  marketValue: 15678.45,
  netGainPercentage: 56.78, // This will determine plant growth
};

export default function Profile() {
  const [showGrowthNotification, setShowGrowthNotification] = useState(false);
  const [growthMessage, setGrowthMessage] = useState("");

  const { token } = useAuth();
  const { logout } = useAuth();

  const handlePlantGrowth = (newStage: any) => {
    setGrowthMessage(
      `🌱 Congratulations! Your plant has grown to ${newStage.name}!`
    );
    setShowGrowthNotification(true);
    setTimeout(() => setShowGrowthNotification(false), 5000);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="bg-accent-foreground rounded-3xl p-8 max-w-2xl w-full">
        {/* Growth Notification */}
        {showGrowthNotification && (
          <div className="fixed top-4 right-4 bg-white rounded-lg p-4 shadow-lg">
            <p className="text-accent">{growthMessage}</p>
          </div>
        )}

        {/* Profile Header with Plant Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <PlantAvatar
              netGainPercentage={profileData.netGainPercentage}
              onGrowth={handlePlantGrowth}
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {profileData.username}
          </h1>
          <p className="text-white opacity-80">
            Member since: {profileData.memberSince.toLocaleDateString()}
          </p>
        </div>

        {/* Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Net Value */}
          <div className="bg-white rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Total Net Value
            </h3>
            <p className="text-2xl font-bold text-accent">
              ${profileData.totalNetValue.toLocaleString()}
            </p>
          </div>

          {/* Cash Value */}
          <div className="bg-white rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Cash Value
            </h3>
            <p className="text-2xl font-bold text-accent">
              ${profileData.cashValue.toLocaleString()}
            </p>
          </div>

          {/* Market Value */}
          <div className="bg-white rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Market Value
            </h3>
            <p className="text-2xl font-bold text-accent">
              ${profileData.marketValue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Plant Progress Section */}
        <div className="mt-8 bg-white rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-accent mb-4">
            Trading Journey
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Your plant grows as you make profitable trades. Keep trading
              wisely to see it flourish!
            </p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-accent font-semibold">
                Current Net Gain: {profileData.netGainPercentage}%
              </p>
            </div>
          </div>
        </div>
        <button
          className="bg-text text-white rounded-2xl py-3 mt-4 w-full font-extrabold text-xl hover:bg-textHover transition duration-150"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
