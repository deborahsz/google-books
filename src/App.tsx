import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center">✨ Biblioteca Mágica ✨</h1>
        </header>
        <main className="px-4 sm:px-6 lg:px-8 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<Details />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;