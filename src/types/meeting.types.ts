export interface Meeting {
  id: string;
  time: string; // e.g. "10:00 AM"
  title: string;
  participants?: string[];
  location?: string;
}
