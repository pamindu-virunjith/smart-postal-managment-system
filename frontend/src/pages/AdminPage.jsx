import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FaUsers, FaQrcode } from "react-icons/fa";
import { MdOutlineWarehouse, MdQrCodeScanner } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FiHome, FiMenu, FiX, FiFileText, FiMonitor } from "react-icons/fi"; 
import '../App.css';
import ParcelPage from "./admin/parcel.jsx";
import AddParcel from "./admin/addParcel.jsx";
import EditParcel from "./admin/editParcel.jsx";
import UsersPage from "./admin/usersPage.jsx";
import CreateAdminAccount from "./admin/createAccount.jsx";
import ReportPage from "./admin/reportPage.jsx";
import AdminQRScanner from "./AdminQRScanner.jsx";
import RealTimeDashboard from "./admin/RealTimeDashboard.jsx";
import { VscSignOut } from "react-icons/vsc";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WelcomeAdmin from "../components/welcomeAdmin.jsx";
import ScanQR from "./ScanQR.jsx";
import EditUser from "./admin/EditUser.jsx";

export default function AdminPage() {
    const location = useLocation();
    const path = location.pathname;
    const [status, setStatus] = useState("loading");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setStatus("unauthenticated");
            window.location.href = "/";
        } else {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.role !== "admin") {
                        setStatus("unauthorized");
                        window.location.href = "/home";
                        toast.error("You are not authorized to access this page");
                    } else {
                        setStatus("authenticated");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setStatus("unauthenticated");
                    window.location.href = "/";
                    toast.error("You are not authenticated, please login");
                });
        }
    }, [status]);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="w-full h-screen flex bg-gradient-to-br from-blue-50 via-white to-gray-100">
            {status === "loading" || status === "unauthenticated" || status === "unauthorized" ? (
                <div className="flex justify-center items-center w-full h-full">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-b-transparent border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Mobile top bar */}
                    <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl flex items-center px-4 z-50">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-white"
                        >
                            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                        <h1 className="ml-4 font-bold text-xl text-white tracking-wide">Admin Dashboard</h1>
                        <div className="ml-auto flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                                {JSON.parse(localStorage.getItem("user"))?.name?.[0] || "A"}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div
                        className={`fixed top-0 left-0 h-full w-[280px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl
                                    flex flex-col p-6 pt-20 md:pt-6
                                    transition-transform duration-300 z-40
                                    border-r border-slate-700
                                    ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                    >
                        {/* User Profile Section */}
                        <div className="mb-8 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-3 ring-4 ring-blue-400/30">
                                {JSON.parse(localStorage.getItem("user"))?.name?.[0] || "A"}
                            </div>
                            <span className="text-lg font-semibold text-white">{JSON.parse(localStorage.getItem("user"))?.name || "Admin"}</span>
                            <span className="text-sm text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">Administrator</span>
                        </div>
                        
                        <nav className="flex-1 space-y-3">
                            <Link
                                to="/admin/"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                    path === "/admin/" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                            >
                                <FiHome className={`mr-3 transition-all duration-200 ${path === "/admin/" ? "text-white" : "text-blue-400 group-hover:text-blue-300"}`} /> Home
                            </Link>
                            <Link
                                to="/admin/users"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                    path === "/admin/users" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                            >
                                <FaUsers className={`mr-3 transition-all duration-200 ${path === "/admin/users" ? "text-white" : "text-blue-400 group-hover:text-blue-300"}`} /> Users
                            </Link>
                            <Link
                                to="/admin/parcel"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                    path === "/admin/parcel" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                            >
                                <MdOutlineWarehouse className={`mr-3 transition-all duration-200 ${path === "/admin/parcel" ? "text-white" : "text-green-400 group-hover:text-green-300"}`} /> Parcel
                            </Link>
                            <Link
                                to="/admin/createaccount"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                    path === "/admin/createaccount" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                            >
                                <LiaFileInvoiceSolid className={`mr-3 transition-all duration-200 ${path === "/admin/createaccount" ? "text-white" : "text-rose-400 group-hover:text-rose-300"}`} /> Create Account
                            </Link>
                            <Link
                                to="/admin/reports"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                    path === "/admin/reports" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                            >
                                <FiFileText className={`mr-3 transition-all duration-200 ${path === "/admin/reports" ? "text-white" : "text-orange-400 group-hover:text-orange-300"}`} /> Reports
                            </Link>
                            <Link
                                to="/admin/parcel-scanner"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                    path === "/admin/parcel-scanner" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                            >
                                <MdQrCodeScanner className={`mr-3 transition-all duration-200 ${path === "/admin/parcel-scanner" ? "text-white" : "text-purple-400 group-hover:text-purple-300"}`} /> QR Scanner
                            </Link>
                            <Link
                                to="/admin/dashboard"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                    path === "/admin/dashboard" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                            >
                                <FiMonitor className={`mr-3 transition-all duration-200 ${path === "/admin/dashboard" ? "text-white" : "text-cyan-400 group-hover:text-cyan-300"}`} /> Live Dashboard
                            </Link>
                        </nav>
                        
                        {/* Sign Out Button */}
                        <div className="pt-4 border-t border-slate-700">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center w-full px-4 py-3 rounded-xl font-semibold text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
                            >
                                <VscSignOut className="mr-3 text-red-400 group-hover:text-red-300 transition-all duration-200" /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Dark overlay on mobile */}
                    {menuOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                            onClick={() => setMenuOpen(false)}
                        ></div>
                    )}

                    {/* Main content */}
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 overflow-y-auto md:ml-[280px] mt-16 md:mt-0 shadow-inner">
                        <Routes path="/*">
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/parcel" element={<ParcelPage />} />
                            <Route path="/createaccount" element={<CreateAdminAccount />} />
                            <Route path="/addparcel" element={<AddParcel />} />
                            <Route path="/editparcel/" element={<EditParcel />} />
                            <Route path="/reports" element={<ReportPage />} />
                            <Route path="/parcel-scanner" element={<AdminQRScanner />} />
                            <Route path="/dashboard" element={<RealTimeDashboard />} />
                            <Route path="/" element={<WelcomeAdmin />} />
                            <Route path="/scan" element={<ScanQR />} />
                            <Route path="/edituser" element={<EditUser />} />
                        </Routes>
                    </div>
                </>
            )}
        </div>
    );
}
