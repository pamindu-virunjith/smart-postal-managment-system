import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdOutlineWarehouse } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import '../App.css';
import ParcelPage from "./admin/parcel";
import AddParcel from "./admin/addParcel";
import EditParcel from "./admin/editParcel";
import UsersPage from "./admin/usersPage";
import CreateAdminAccount from "./admin/createAccount";
import { VscSignOut } from "react-icons/vsc";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WelcomeAdmin from "../components/welcomeAdmin.jsx";
import { FiHome, FiMenu, FiX } from "react-icons/fi"; 
import ScanQR from "./ScanQR.jsx";

export default function AdminPage() {
    const location = useLocation();
    const path = location.pathname;
    const [status,setStatus] = useState("loading")
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(!token){
            setStatus("unauthenticated");
            window.location.href = "/"
        }else{
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/me",{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }).then((response)=>{
                if(response.data.role !== "admin"){
                    setStatus("unauthorized");
                    window.location.href = "/home";
                    toast.error("You are not authorized to access this page");
                }else{
                    setStatus("authenticated");
                }
            }).catch((err)=>{
                console.log(err);
                setStatus("unauthenticated");
                window.location.href="/";
                toast.error("You are not authenticated, please login");
            });
        }
    },[status])

    const handleSignOut = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className='w-full h-screen flex bg-gray-100'>
            {status == 'loading' || status == 'unauthenticated'|| status == 'unauthorized'?
                <div className="flex justify-center items-center w-full h-full">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-b-transparent border-blue-500"></div>
                </div>:
                <>
                    {/* Mobile top bar */}
                    <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-white shadow flex items-center px-4 z-50">
                        <button 
                            onClick={()=>setMenuOpen(!menuOpen)} 
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            {menuOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
                        </button>
                        <h1 className="ml-4 font-semibold text-lg text-gray-700">Admin Dashboard</h1>
                    </div>

                    {/* Sidebar */}
                    <div className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-xl
                                    flex flex-col p-4 pt-20 md:pt-4 
                                    transition-transform duration-300 z-40 
                                    ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                        <nav className="flex-1 space-y-2">
                            <Link to="/admin/" 
                                onClick={()=>setMenuOpen(false)}
                                className={`flex items-center px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition ${path === "/admin/" ? "bg-gray-200" : ""}`}>
                                <FiHome className="mr-3"/> Home
                            </Link>
                            <Link to="/admin/users" 
                                onClick={()=>setMenuOpen(false)}
                                className={`flex items-center px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition ${path === "/admin/users" ? "bg-gray-200" : ""}`}>
                                <FaUsers className="mr-3 text-blue-600"/> Users
                            </Link>
                            <Link to="/admin/parcel" 
                                onClick={()=>setMenuOpen(false)}
                                className={`flex items-center px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition ${path === "/admin/parcel" ? "bg-gray-200" : ""}`}>
                                <MdOutlineWarehouse className="mr-3 text-green-600"/> Parcel
                            </Link>
                            <Link to="/admin/createaccount" 
                                onClick={()=>setMenuOpen(false)}
                                className={`flex items-center px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition ${path === "/admin/createaccount" ? "bg-gray-200" : ""}`}>
                                <LiaFileInvoiceSolid className="mr-3 text-rose-600"/> Create Account
                            </Link>
                        </nav>
                        <div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center w-full px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                            >
                                <VscSignOut className="mr-3"/> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Dark overlay on mobile */}
                    {menuOpen && (
                        <div 
                            className="fixed inset-0  bg-opacity-40 z-30 md:hidden"
                            onClick={()=>setMenuOpen(false)}
                        ></div>
                    )}

                    {/* Main content */}
                    <div className="flex-1 bg-white shadow-inner p-4 overflow-y-auto md:ml-[250px] mt-14 md:mt-0">
                        <Routes path="/*">
                            <Route path="/users" element={<UsersPage/>} />
                            <Route path="/parcel" element={<ParcelPage />} />
                            <Route path="/createaccount" element={<CreateAdminAccount />} />
                            <Route path="/addparcel" element={<AddParcel />} />
                            <Route path="/editparcel/" element={<EditParcel />} />
                            <Route path="/" element={<WelcomeAdmin />} /> 
                            <Route path="/scan" element={<ScanQR />} />
                        </Routes>
                    </div>
                </>
            }
        </div>
    )
}
