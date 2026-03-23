import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '../types/types';
import { coursesApi } from '../api/api-client';

interface CourseState {
  courses: Course[];
  currentCourse?: Course | null;
  loading: boolean;
  error?: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk<Course[]>(
  'courses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await coursesApi.getAll();
      return response.data as Course[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk<Course, number>(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coursesApi.getById(id);
      return response.data as Course;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse(state) {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to load courses";
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.currentCourse = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to load course";
      });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;