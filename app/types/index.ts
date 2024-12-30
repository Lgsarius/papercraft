export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  status: 'draft' | 'in_progress' | 'review' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  deadline?: Date;
  subject?: string;
  sources?: string[];
} 