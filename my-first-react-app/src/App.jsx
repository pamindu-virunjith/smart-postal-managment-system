import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/registerPage'
import AdminPage from './pages/adminPage'
import Home from './pages/Home'

function App() {
  
  return (
    <BrowserRouter>
    <Toaster position="top-center" />
      <Routes path="/*">
        <Route path="/*" element={<Home/>} />
        <Route path="/login" element= {<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/admin/*" element={<AdminPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
