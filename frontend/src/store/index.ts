import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './studentSlice';
import enrollmentReducer from './enrollmentSlice';
import courseSectionsReducer from './courseSectionsSlice';

export const store = configureStore({
  reducer: {
    student: studentReducer,
    enrollment: enrollmentReducer,
    courseSections: courseSectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;