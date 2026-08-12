import ReactDOM from 'react-dom/client'
import React from 'react';
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
