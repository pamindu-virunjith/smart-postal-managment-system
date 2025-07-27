import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/registerPage'
import HomePage from './pages/homePage'
import AdminPage from './pages/adminPage'
import Header from './components/Header'
import OrdersPage from './pages/OrdersPage'
import AboutPage from './pages/AboutPage'
import Footer from './components/Footer'

function App() {
  
  return (
    <BrowserRouter>
    <Toaster position="top-center" />
      <Header/>

      <Routes path="/*">
        <Route path="/" element= {<LoginPage />} />
        <Route path="/home/*" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/orders" element={<OrdersPage/>} />
      </Routes>

      <Footer/>

    </BrowserRouter>
  )
}

export default App
