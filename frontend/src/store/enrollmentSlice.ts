import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enrollmentsApi, studentsApi } from '../api/api-client';
import { Enrollment } from '../types/types';

interface EnrollmentState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  loading: false,
  error: null,
};

export const fetchEnrollments = createAsyncThunk(
  'enrollment/fetchForStudent',
  async (studentId: number) => {
    const response = await studentsApi.getSchedule(studentId);
    return response.data as Enrollment[];
  }
);

export const enrollInSection = createAsyncThunk(
  'enrollment/enrollInSection',
  async ({ studentId, courseSectionId }: { studentId: number, courseSectionId: number }, { rejectWithValue }) => {
    try {
      const response = await enrollmentsApi.enroll(studentId, courseSectionId);
      return response.data as Enrollment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Enrollment failed');
    }
  }
);

export const dropEnrollment = createAsyncThunk(
  'enrollment/dropEnrollment',
  async (
    { studentId, courseSectionId }: { studentId: number, courseSectionId: number },
    { rejectWithValue }
  ) => {
    try {
      await enrollmentsApi.drop(studentId, courseSectionId);
      return { studentId, courseSectionId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to drop enrollment');
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    clearEnrollments: (state) => {
      state.enrollments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load enrollments';
      })
      .addCase(enrollInSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInSection.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments.push(action.payload);
      })
      .addCase(enrollInSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Enrollment failed';
      })
      .addCase(dropEnrollment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dropEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.enrollments.findIndex(e => e.courseSectionId === action.payload.courseSectionId);
        if (idx >= 0) {
          state.enrollments.splice(idx, 1);
        }
      })
      .addCase(dropEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to drop enrollment';
      });
  },
});

export const { clearEnrollments } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;