import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // Import the AppRoutes

const App = () => {
  return (
    <Router>
      <AppRoutes /> {/* Use AppRoutes here */}
    </Router>
  );
};

export default App;
