// client/src/App.js
import React from 'react';
import SignUpMultiStep from './components/SignUpMultiStep'; // Import the new component
import './index.css';

function App() {
  return (
    <div className="App">
      <SignUpMultiStep /> {/* Display the new component */}
    </div>
  );
}

export default App;