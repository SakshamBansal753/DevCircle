import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Browser from './Browser.jsx';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import Board from './Components/Board.jsx';
const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path='/home' element={<Browser/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path="/board" element={<Board/>}/>
      <Route path='/register' element={<Register/>}/>
      </Routes></BrowserRouter>
  )
}

export default App