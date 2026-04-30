import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import Setup from './components/Setup';
import Interview from './components/Interview';
import Results from './components/Results';
import Navbar from './components/Navbar';

function MainApp() {
  const [screen, setScreen] = useState('setup');
  const [session, setSession] = useState(null);
  const [resultData, setResultData] = useState(null);

  function handleStart(sessionData) {
    setSession(sessionData);
    setScreen('interview');
  }

  function handleFinish(results) {
    if (results === null) {
      setSession(null);
      setScreen('setup');
      return;
    }
    setResultData(results);
    setScreen('results');
  }

  function handleRestart() {
    setSession(null);
    setResultData(null);
    setScreen('setup');
  }

  return (
    <>
      <Navbar />
      {screen === 'setup' && <Setup onStart={handleStart} />}
      {screen === 'interview' && <Interview session={session} onFinish={handleFinish} />}
      {screen === 'results' && <Results data={resultData} onRestart={handleRestart} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <History />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}