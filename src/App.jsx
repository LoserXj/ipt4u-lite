import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Methodology from './pages/Methodology'
import Data from './pages/Data'
import DisasterPage from './pages/Data/DisasterPage'
import Assessment from './pages/Assessment'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/data" element={<Data />} />
        <Route path="/data/disaster" element={<DisasterPage />} />
        <Route path="/assessment" element={<Assessment />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
