import React from 'react';
import './App.css';
import Todo from './component/todo';
import Header from './component/header';


function App() {
  return (
   
<div className="min-h-screen bg-gray-800 text-gray-800">
  <Header className="py-4 bg-gray-100 text-gray-800" />
  <Todo className="py-8" />
</div>


  );
}

export default App;


