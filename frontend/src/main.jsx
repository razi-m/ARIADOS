import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import { DefectProvider } from './context/DefectContext';
import { ReportProvider } from './context/ReportContext';
import { ToastProvider } from './components/common/Toast';
import './index.css';

import ErrorBoundary from './components/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <VideoProvider>
              <DefectProvider>
                <ReportProvider>
                  <App />
                </ReportProvider>
              </DefectProvider>
            </VideoProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);