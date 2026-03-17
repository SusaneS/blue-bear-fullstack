import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Hero */}
      <div className="text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Maplewood Course Planning</h1>
        <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
          Plan your academic journey, avoid scheduling conflicts, and track your progress toward graduation.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/courses"
          className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group text-center"
        >
          <div className="text-4xl mb-3">📚</div>
          <h2 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            Course Catalog
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Browse all available courses with credits, prerequisites, and grade requirements.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
            Browse Courses →
          </div>
        </Link>

        <Link
          to="/planner"
          className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group text-center"
        >
          <div className="text-4xl mb-3">📅</div>
          <h2 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            Semester Planner
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Build your semester schedule while avoiding time conflicts and prerequisite violations.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
            Plan Schedule →
          </div>
        </Link>

        <Link
          to="/progress"
          className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group text-center"
        >
          <div className="text-4xl mb-3">📊</div>
          <h2 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            Graduation Progress
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Monitor your GPA, earned credits, and remaining requirements to graduate.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
            View Progress →
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="card bg-blue-50 border-blue-200">
        <h2 className="font-bold text-blue-800 mb-3">📌 Quick Start Guide</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
          <li>Start at <strong>Course Catalog</strong> to see all available courses and their prerequisites</li>
          <li>Go to <strong>Semester Planner</strong> to build your schedule — the system will check for conflicts automatically</li>
          <li>Visit <strong>Graduation Progress</strong> to see how many credits you need and track your GPA</li>
        </ol>
      </div>
    </div>
  );
}
