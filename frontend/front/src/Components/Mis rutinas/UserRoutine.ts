export interface UserWorkoutRoutine {
    id: string;
    created_at: string;
    assigned_by_role: string;
    workout_routine: {
      name: string;
      description?: string;
      imageUrl?: string;
    };
  }
  