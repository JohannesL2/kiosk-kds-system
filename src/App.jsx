import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.css'
import KioskView from './pages/KioskView';
import KitchenView from './pages/KitchenView';

const socket = io('http://localhost:4000');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<KioskView socket={socket} />} />
        <Route path='/kitchen' element={<KitchenView socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
