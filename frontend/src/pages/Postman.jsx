import { Routes, Route, Link, useLocation } from "react-router-dom";
import { MdOutlineWarehouse } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import '../App.css';
// import ParcelPage from "./postman/parcel";
import EditParcel from "./postman/editParcel";
import CreateAdminAccount from "./postman/createAccount";
import SearchParcels from "./postman/searchParcels";
import ShowParcels from "./postman/showParcels";
import ShowParcelDetails from "./postman/showParcelDetails";
import { VscSignOut } from "react-icons/vsc";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WelcomePostman from "../components/WelcomePostman";
import { FiHome } from "react-icons/fi";


export default function Postman() {
    const location = useLocation();
    const path = location.pathname;
    const [status, setStatus] = useState("loading");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser?.name || "Postman";

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
                    if (response.data.role !== "postman") {
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

    return (
        <div className="w-full h-screen flex bg-gradient-to-br from-blue-100 to-blue-300 p-4">
            {status === "loading" ||
            status === "unauthenticated" ||
            status === "unauthorized" ? (
                <div className="flex justify-center items-center w-full h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-b-white border-blue-500"></div>
                </div>
            ) : (
                <>
                    <aside className="h-full w-[280px] bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col mr-6 border border-blue-200">
                        <div className="mb-8 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-blue-300 flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-2">
                                {userName[0]}
                            </div>
                            <span className="text-lg font-semibold text-blue-700">{userName}</span>
                            <span className="text-xs text-gray-500">Postman</span>
                        </div>
                        <nav className="flex-1">
                            <Link
                                to="/postman/"
                                className={`p-3 my-1 flex items-center text-lg font-medium hover:bg-blue-100 transition rounded-xl ${
                                    path === "/postman/" ? "bg-blue-200 text-blue-700" : "text-gray-700"
                                }`}
                            >
                                <FiHome className="mr-3" /> Home
                            </Link>
                            <Link
                                to="/postman/searchparcels"
                                className={`p-3 my-1 flex items-center text-lg font-medium hover:bg-blue-100 transition rounded-xl ${
                                    path === "/postman/parcel" ? "bg-blue-200 text-blue-700" : "text-gray-700"
                                }`}
                            >
                                <MdOutlineWarehouse className="mr-3 text-green-500" /> Parcel
                            </Link>
                            <Link
                                to="/postman/createaccount"
                                className={`p-3 my-1 flex items-center text-lg font-medium hover:bg-blue-100 transition rounded-xl ${
                                    path === "/postman/createaccount" ? "bg-blue-200 text-blue-700" : "text-gray-700"
                                }`}
                            >
                                <LiaFileInvoiceSolid className="mr-3 text-rose-600" /> Create Account
                            </Link>
                        </nav>
                        <div className="mt-auto">
                            <Link
                                to="/"
                                className={`p-3 flex items-center text-lg font-medium hover:bg-blue-100 transition rounded-xl ${
                                    path === "/" ? "bg-blue-200 text-blue-700" : "text-gray-700"
                                }`}
                            >
                                <VscSignOut className="mr-3" /> Sign Out
                            </Link>
                        </div>
                    </aside>

                    <main className="h-full bg-white/90 w-full rounded-2xl shadow-2xl p-8 overflow-y-auto border border-blue-200">
                        <Routes path="/*">
                            <Route path="/" element={<WelcomePostman />} />
                            <Route path="/createaccount" element={<CreateAdminAccount />} />
                            <Route path="/editparcel/" element={<EditParcel />} />
                            <Route path="/searchparcels" element={<SearchParcels />} />
                            <Route path="/showparcels" element={<ShowParcels />} />
                            <Route path="/showparceldetails/" element={<ShowParcelDetails />} />
                        </Routes>
                    </main>
                </>
            )}
        </div>
    );
}