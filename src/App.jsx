import { Routes, Route } from 'react-router-dom';
import SetupScreen from './components/SetupScreen';
import HostDashboard from './components/HostDashboard';
import GuestView from './components/GuestView';
import ResultScreen from './components/ResultScreen';
import ThemeScreen from './components/ThemeScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SetupScreen />} />
      <Route path="/host" element={<HostDashboard />} />
      <Route path="/guest" element={<GuestView />} />
      <Route path="/result" element={<ResultScreen />} />
      <Route path="/theme" element={<ThemeScreen />} />
    </Routes>
  );
}

export default App;
