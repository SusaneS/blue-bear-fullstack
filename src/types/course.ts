export interface Course {
  id: string;
  name: string;
  description: string;
  credits: number;
  prerequisiteCourse: string | null;
  gradeLevelMin: number;
  gradeLevelMax: number;
}
