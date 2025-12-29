import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found in index.html");
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (error) {
    console.error("React Mounting Error:", error);
    rootElement.innerHTML = `
      <div style="background: #0f172a; color: white; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;">
        <div>
          <h1 style="color: #ef4444;">System Boot Failure</h1>
          <p style="color: #94a3b8; margin-top: 10px;">The application failed to start. Please check the browser console (F12) for error details.</p>
        </div>
      </div>
    `;
  }
}
