import React from 'react';
import { Provider } from 'react-redux';
import TabLayout from './components/TabLayout';
import './App.css';
import { store } from './store/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>🍁 Maplewood High School</h1>
        </header>
        <main>
          <TabLayout />
        </main>
      </div>
    </Provider>
  );
};

export default App;