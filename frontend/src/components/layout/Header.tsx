import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/courses', label: 'Course Catalog', icon: '📚' },
  { to: '/planner', label: 'Semester Planner', icon: '📅' },
  { to: '/progress', label: 'Graduation Progress', icon: '🎓' },
];

export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / School Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-xl">
              🐻
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">Maplewood High School</p>
              <p className="text-blue-200 text-xs">Course Planning System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Student Badge */}
          <div className="flex items-center gap-2 bg-blue-800 px-3 py-1.5 rounded-lg">
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
              AJ
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">Alex Johnson</p>
              <p className="text-blue-300 text-xs">Grade 11 · ID: S001</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-1 pb-3">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'bg-white text-blue-700' : 'text-blue-100 hover:bg-blue-600'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
