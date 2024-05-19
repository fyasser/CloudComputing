import React from 'react';
import { Routes, Route } from "react-router-dom";
import RecipePage from './pages/RecipePage';
function App() {
  return (
      <Routes>
        {/* Home page */}
        <Route path="/" element={<RecipePage />} />
      </Routes>
  );
}

export default App;
