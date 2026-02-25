import { Route, Routes } from "react-router-dom"
import HomePage from "./HomePage.jsx";
import AboutPage from "./AboutPage";
import OrdersPage from "./OrdersPage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot.jsx";

function Home() {
  return (
    <div>
        <Header/>
        <ChatBot />
        <div>
            <Routes path='/*'>
                <Route path="/*" element={<HomePage />} />
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/orders" element={<OrdersPage/>}/>
            </Routes>
        </div>
        <Footer/>
    </div>
  )
}

export default Home