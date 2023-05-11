import React from 'react';
import './App.css';
import AppRouters from './components/AppRouters';
import { BrowserRouter  } from 'react-router-dom';
import { APP_URL } from './constants/app-config';

function App() {
  return (
    <BrowserRouter >
      <AppRouters />
    </BrowserRouter >
  );
}

export default App;
