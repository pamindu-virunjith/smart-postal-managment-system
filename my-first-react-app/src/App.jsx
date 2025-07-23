import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/registerPage'
import HomePage from './pages/homePage'
import AdminPage from './pages/adminPage'

function App() {
  
  return (
    <BrowserRouter>
    <Toaster position="top-center" /> 
      <Routes path="/*">
        <Route path="/" element= {<LoginPage />} />
        <Route path="/home/*" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
