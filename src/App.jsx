import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import './index.css';

export default function App() {
  return (
    <ContentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </ContentProvider>
  );
}
