import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/loginPage";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/registerPage";
import AdminPage from "./pages/AdminPage";
import Home from "./pages/Home";
import Postman from "./pages/Postman";
import ScanQR from "./pages/ScanQR";
import QRScanner from "./pages/QRScanner";
import CameraQRScanner from "./pages/CameraQRScanner";
import QRScannerHub from "./pages/QRScannerHub";
import SimpleQRScanner from "./pages/SimpleQRScanner";
import SocketTest from "./pages/SocketTest";

// import ForgetPassword from "./pages/forgetPassword";

import { GoogleOAuthProvider } from '@react-oauth/google';
import ChatBot from "./components/ChatBot";
// import Sample from './pages/sample'

function App() {
  return (
    <GoogleOAuthProvider clientId="402043730174-iaoh3h0qu5344bk29ntum7r0s34l225n.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster position="top-center" />
        
        <Routes path="/*">
          <Route path="/*" element={<Home />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/postman/*" element={<Postman />} />
          <Route path="/scan" element={<ScanQR />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/camera-scanner" element={<CameraQRScanner />} />
          <Route path="/simple-scanner" element={<SimpleQRScanner />} />
          <Route path="/qr-hub" element={<QRScannerHub />} />
          <Route path="/socket-test" element={<SocketTest />} />
          {/* <Route path="/forget-password" element={<ForgetPassword />} /> */}

          {/* <Route path='/sample' element={<Sample/>}/> */}
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
