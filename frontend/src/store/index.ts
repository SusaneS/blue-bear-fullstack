import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './studentSlice';
import enrollmentReducer from './enrollmentSlice';
import courseSectionsReducer from './courseSectionsSlice';
import courseReducer from './courseSlice';

export const store = configureStore({
  reducer: {
    student: studentReducer,
    course: courseReducer,
    enrollment: enrollmentReducer,
    courseSections: courseSectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;