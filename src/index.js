import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./components/App";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import * as serviceWorkerRegistration from "./utils/serviceWorkerRegistration";
import reportWebVitals, { logWebVitals } from "./utils/reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register service worker with auto-update prompt
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // When a new service worker is available, prompt user to update
    const userConfirmed = window.confirm(
      '有新版本可用！點擊「確定」立即更新，或點擊「取消」稍後更新。\n\nA new version is available! Click OK to update now, or Cancel to update later.'
    );

    if (userConfirmed && registration.waiting) {
      // Tell the waiting service worker to skip waiting and become active
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Listen for the service worker to become active
      registration.waiting.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          // Reload the page to get the new content
          window.location.reload();
        }
      });
    }
  },
  onSuccess: (registration) => {
    console.log('Service Worker registered successfully. App is ready for offline use.');
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(logWebVitals);
