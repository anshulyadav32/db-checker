
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DbChecker from './components/DbChecker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DbChecker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
