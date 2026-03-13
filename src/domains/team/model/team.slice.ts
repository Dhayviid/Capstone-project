import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TeamMember, TeamState } from "./team.types";

// Simulated API delay
const simulateApiDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Async thunks
export const fetchTeamMembers = createAsyncThunk(
  "team/fetchTeamMembers",
  async (_, { rejectWithValue }) => {
    try {
      await simulateApiDelay();
      const saved = localStorage.getItem("teamMembers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return rejectWithValue("Failed to fetch team members");
    }
  },
);

export const addTeamMember = createAsyncThunk(
  "team/addTeamMember",
  async (memberData: Omit<TeamMember, "id">, { rejectWithValue }) => {
    try {
      await simulateApiDelay();
      const newMember: TeamMember = {
        ...memberData,
        id: Date.now().toString(),
      };

      const saved = localStorage.getItem("teamMembers");
      const members = saved ? JSON.parse(saved) : [];
      members.push(newMember);
      localStorage.setItem("teamMembers", JSON.stringify(members));

      return newMember;
    } catch {
      return rejectWithValue("Failed to add team member");
    }
  },
);

export const removeTeamMember = createAsyncThunk(
  "team/removeTeamMember",
  async (memberId: string, { rejectWithValue }) => {
    try {
      await simulateApiDelay();
      const saved = localStorage.getItem("teamMembers");
      const members = saved ? JSON.parse(saved) : [];
      const filteredMembers = members.filter(
        (m: TeamMember) => m.id !== memberId,
      );
      localStorage.setItem("teamMembers", JSON.stringify(filteredMembers));

      return memberId;
    } catch {
      return rejectWithValue("Failed to remove team member");
    }
  },
);

const initialState: TeamState = {
  members: [],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.push(action.payload);
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter((m) => m.id !== action.payload);
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teamSlice.reducer;
