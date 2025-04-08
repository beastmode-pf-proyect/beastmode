export default interface Exercise {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  assignedBy: string;
}

export interface ExerciseCardItemProps {
  exercise: {
    id: number;
    imageUrl: string;
    altText: string;
    title: string;
    assignedBy: string;
  };
}
