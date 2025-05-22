
import './App.css'
import { isAuthenticated } from './auth'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import MeetingPage from './components/MeetingPage'
import MeetingRoom from './components/MeetingRoom'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/meeting/:id" element={<MeetingRoom />} />
    </Routes>
  )
}

export default App
