"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Workout {
  id: string;
  name: string;
  description: string;
  // Add other fields based on your actual API response
}

export const SimpleUserWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!isAuthenticated || !user?.sub) return;
      
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        
        // Important fixes:
        // 1. Encode user ID
        const userId = encodeURIComponent(user.sub);
        
        // 2. Use proper endpoint from your image (adjust as needed)
        const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/basiccard/user/${userId}`;
        
        const response = await fetch(endpoint, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle both array and object responses
        const workoutsData = Array.isArray(data) ? data : [data];
        setWorkouts(workoutsData);
        
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to load workouts");
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  if (!isAuthenticated) return <p>Please login to view workouts</p>;
  if (loading) return <p>Loading workouts...</p>;

  return (
    <div className="workout-container">
      {workouts.length > 0 ? (
        workouts.map(workout => (
          <div key={workout.id} className="workout-card">
            <h3>{workout.name}</h3>
            <p>{workout.description}</p>
          </div>
        ))
      ) : (
        <p>No workouts found</p>
      )}
    </div>
  );
};