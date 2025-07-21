import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/registerPage'
import HomePage from './pages/homePage'

function App() {
  
  return (
    <BrowserRouter>
    <Toaster position="top-center" /> 
      <Routes path="/*">
        <Route path="/*" element= {<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
