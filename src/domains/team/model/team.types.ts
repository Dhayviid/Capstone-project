export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

export interface TeamState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
}
