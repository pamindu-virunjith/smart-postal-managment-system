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
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WelcomeAdmin from "../components/welcomeAdmin.jsx";
import { FiHome } from "react-icons/fi";
import ScanQR from "./ScanQR.jsx";

export default function AdminPage() {

    const location = useLocation();
    const path = location.pathname;
    const [status,setStatus] = useState("loading")

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
        <div className='w-full h-screen flex bg-gray-100 p-2 '>
            {status == 'loading' || status == 'unauthenticated'|| status == 'unauthorized'?
                <div className="flex justify-center items-center w-full h-full">
                    <div className="animate-spin rounded-full h-13 w-13 border-4 border-b-white border-blue-500"></div>
                </div>:
                <>
                    <div className='h-full w-[300px] bg-red-200 rounded-xl shadow-lg p-4 flex flex-col mr-2 '>
                <div className="h-[calc(100vw-50px)]">
                    <Link to ="/admin/" className={`p-2 my-0.5 flex items-center text-xl hover:bg-red-300 rounded-xl ${path === "/admin/" ? "bg-red-300" : ""}`} > <FiHome  className="mr-2"/> Home</Link>
                    <Link to ="/admin/users" className={`p-2 my-0.5 flex items-center text-xl hover:bg-red-300 rounded-xl ${path === "/admin/users" ? "bg-red-300" : ""}`} > <FaUsers className="mr-2 text-blue-700"/> Users</Link>
                    <Link to ="/admin/parcel" className={`p-2 my-0.5 flex items-center text-xl hover:bg-red-300 rounded-xl ${path === "/admin/parcel" ? "bg-red-300" : ""}`} > <MdOutlineWarehouse className="mr-2 text-green-500"/> Parcel</Link>
                    <Link to ="/admin/createaccount" className={`p-2 my-0.5 flex items-center text-xl hover:bg-red-300 rounded-xl ${path === "/admin/createaccount" ? "bg-red-300" : ""}`} > <LiaFileInvoiceSolid className="mr-2 text-rose-600"/> Create Account</Link>
                </div>
                <div className="h-[50px]">
                    <button
                                onClick={handleSignOut}
                                className={`p-2 my-0.5 flex items-center text-xl hover:bg-red-300 rounded-xl w-full`}
                            >
                                <VscSignOut className="mr-2 "/> Sign Out
                            </button>
                </div>
            </div>

            <div className="h-full bg-white w-[calc(100vw-300px)] rounded-xl shadow-lg p-4 overflow-y-auto ">
                
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
