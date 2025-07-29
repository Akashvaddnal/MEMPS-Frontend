import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from '@emotion/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>
  // <ThemeProvider>
  //   <App />
  // </ThemeProvider>
);

// In your index.html, ensure:
// <html style="height: 100%">
//   <body style="height: 100%; margin: 0;">
//     <div id="root" style="height: 100%"></div>
//   </body>
// </html>
