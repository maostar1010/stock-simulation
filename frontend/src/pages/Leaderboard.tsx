"use client";
import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import { useAuth } from "@/components/signup/AuthContext";

interface UserData {
  id: number;
  username: string;
  netGain: number;
  portfolioValue: number;
  profileImage: string;
}

export default function Leaderboard() {
  const { token } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLeaderboardData = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/api/users/sorted/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const data = await response.json();
      console.log('Leaderboard data:', data);
      setLeaderboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeaderboardData();
  }, [token]);

  // Set up interval for periodic updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLeaderboardData();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [token]);

  // Format the last updated time
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="flex justify-center p-8 md:pl-24">
        <div className="container mx-auto px-4 py-8 bg-accent-foreground rounded-3xl max-w-5xl w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-2">Leaderboard</h1>
            <p className="text-xl text-center text-gray-600">
              Top Traders by Net Gain/Loss
            </p>
            <p className="text-sm text-center text-gray-500 mt-2">
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          </div>

          {isLoading && leaderboardData.length === 0 ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
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
          )}

          {/* Manual refresh button */}
          <div className="text-center mt-6">
            <button
              onClick={fetchLeaderboardData}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
