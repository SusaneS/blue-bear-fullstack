import React, { useState } from 'react';
import CourseBrowser from './CourseBrowser';
import StudentProfile from './StudentProfile';
import './TabLayout.css';
import ScheduleBuilder from './ScheduleBuilder';

enum Tab {
  PROFILE = 'profile',
  COURSES = 'courses',
  SCHEDULE = 'schedule',
}

const TAB_CONFIG = [
  { key: Tab.PROFILE, label: '📊 Student Profile' },
  { key: Tab.COURSES, label: '📚 Course Browser' },
  { key: Tab.SCHEDULE, label: '📅 Schedule Builder' },
];

const TabLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PROFILE);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.PROFILE:
        return <StudentProfile />;
      case Tab.COURSES:
        return <CourseBrowser />;
      case Tab.SCHEDULE:
        return <ScheduleBuilder />;
    }
  };

  return (
    <div className="tab-layout">
      <nav className="tab-nav">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default TabLayout;