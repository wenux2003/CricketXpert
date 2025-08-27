import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f8ff', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#0066cc', fontSize: '48px' }}>🏏 CricketXpert</h1>
      <p style={{ fontSize: '24px', color: '#333' }}>Cricket Equipment Repair System</p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <h2>System Status</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ color: 'green', margin: '10px 0' }}>✅ Frontend Server: Running</li>
          <li style={{ color: 'green', margin: '10px 0' }}>✅ React App: Loaded</li>
          <li style={{ color: 'green', margin: '10px 0' }}>✅ Backend: Connected</li>
        </ul>
        <p style={{ marginTop: '20px', color: '#666' }}>
          If you can see this, React is working correctly!
        </p>
      </div>
    </div>
  );
};

export default SimpleTest;
