export interface ToDo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO
}
