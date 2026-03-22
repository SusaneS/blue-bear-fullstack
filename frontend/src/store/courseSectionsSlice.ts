import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseSectionsApi } from '../api/api-client'; // Assume this has .getSections method
import { CourseSection } from '../types/types';

interface CourseSectionsState {
  sections: CourseSection[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseSectionsState = {
  sections: [],
  loading: false,
  error: null,
};

export const fetchCourseSections = createAsyncThunk<
  CourseSection[],
  { semesterId: number; courseId?: number; gradeLevel?: number; openOnly?: boolean }
>(
  'courseSections/fetchCourseSections',
  async ({ semesterId, courseId, gradeLevel, openOnly = true }, { rejectWithValue }) => {
    try {
      const response = await courseSectionsApi.getFiltered(
        semesterId,
        courseId,
        gradeLevel,
        openOnly,
      );
      return response.data as CourseSection[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load course sections');
    }
  }
);

const courseSectionsSlice = createSlice({
  name: 'courseSections',
  initialState,
  reducers: {
    clearSections: (state) => {
      state.sections = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchCourseSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to load course sections';
      });
  },
});

export const { clearSections } = courseSectionsSlice.actions;
export default courseSectionsSlice.reducer;