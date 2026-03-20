import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import StudentSelector from './components/StudentSelector';
import TabLayout from './components/TabLayout';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>🍁 Maplewood High School</h1>
          <StudentSelector />
        </header>
        <main>
          <TabLayout />
        </main>
      </div>
    </Provider>
  );
};

export default App;