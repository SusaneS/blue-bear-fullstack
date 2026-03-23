import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentsApi } from '../api/api-client';
import { Student, StudentProfile } from '../types/types';

interface StudentState {
  students: Student[];
  profile: StudentProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  profile: null,
  loading: false,
  error: null,
};

export const fetchStudents = createAsyncThunk(
  'student/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
        const response = await studentsApi.getAll();
        return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const fetchStudentProfile = createAsyncThunk(
  'student/fetchProfile',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getProfile(studentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to load students';
      })
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to load profile';
      });
  },
});

export const { clearProfile } = studentSlice.actions;
export default studentSlice.reducer;