import { useState } from 'react';
import Setup from './components/Setup';
import Interview from './components/Interview';
import Results from './components/Results';

export default function App() {
  const [screen, setScreen] = useState('setup'); // setup | interview | results
  const [session, setSession] = useState(null);
  const [resultData, setResultData] = useState(null);

  function handleStart(sessionData) {
    setSession(sessionData);
    setScreen('interview');
  }

  function handleFinish(results) {
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
      {screen === 'setup' && <Setup onStart={handleStart} />}
      {screen === 'interview' && <Interview session={session} onFinish={handleFinish} />}
      {screen === 'results' && <Results data={resultData} apiKey={session?.apiKey} onRestart={handleRestart} />}
    </>
  );
}
