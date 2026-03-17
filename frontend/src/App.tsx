import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Home from './pages/Home';
import CourseCatalog from './pages/CourseCatalog';
import SemesterPlanner from './pages/SemesterPlanner';
import GraduationProgress from './pages/GraduationProgress';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/planner" element={<SemesterPlanner />} />
            <Route path="/progress" element={<GraduationProgress />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
            success: { style: { background: '#16a34a' } },
            error: { style: { background: '#dc2626' } },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
