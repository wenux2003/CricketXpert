import React from 'react'
import ReactDOM from 'react-dom/client'
// Make sure the path points to your component inside the components folder
import SignUpMultiStep from './components/SignUpMultiStep.jsx' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SignUpMultiStep />
  </React.StrictMode>,
)