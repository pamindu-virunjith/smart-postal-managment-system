import { Routes, Route, Link, useLocation } from "react-router-dom";
import { MdOutlineWarehouse } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import '../App.css';
import ParcelPage from "./postman/parcel";
import EditParcel from "./postman/editParcel";
import CreateAdminAccount from "./postman/createAccount";
import { VscSignOut } from "react-icons/vsc";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import WelcomePostman from "../components/welcomePostman";
import { FiHome } from "react-icons/fi";


export default function Postman() {
  const location = useLocation();
    const path = location.pathname;
    const [status,setStatus] = useState("loading")

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser?.name || "Postman";

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
                if(response.data.role !== "postman"){
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


    return (
        <div className='w-full h-screen flex bg-gray-100 p-2 '>
            {status == 'loading' || status == 'unauthenticated'|| status == 'unauthorized'?
                <div className="flex justify-center items-center w-full h-full">
                    <div className="animate-spin rounded-full h-13 w-13 border-4 border-b-white border-blue-500"></div>
                </div>:
                <>
                    <div className='h-full w-[300px] bg-blue-200 rounded-xl shadow-lg p-4 flex flex-col mr-2 '>
                <div className="h-[calc(100vw-50px)]">
                    <Link to ="/postman/" className={`p-2 my-0.5 flex items-center text-xl hover:bg-blue-300 rounded-xl ${path === "/postman/" ? "bg-blue-300" : ""}`} > <FiHome  className="mr-2"/> Home</Link>
                    <Link to ="/postman/parcel" className={`p-2 my-0.5 flex items-center text-xl hover:bg-blue-300 rounded-xl ${path === "/postman/parcel" ? "bg-blue-300" : ""}`} > <MdOutlineWarehouse className="mr-2 text-green-500"/> Parcel</Link>
                    <Link to ="/postman/createaccount" className={`p-2 my-0.5 flex items-center text-xl hover:bg-blue-300 rounded-xl ${path === "/postman/createaccount" ? "bg-blue-300" : ""}`} > <LiaFileInvoiceSolid className="mr-2 text-rose-600"/> Create Account</Link>
                </div>
                <div className="h-[50px]">
                    <Link to ="/" className={`p-2 my-0.5 flex items-center text-xl hover:bg-blue-300 rounded-xl ${path === "/" ? "bg-blue-300" : ""}`} > <VscSignOut className="mr-2 "/> Sign Out</Link>
                </div>
            </div>

            <div className="h-full bg-white w-[calc(100vw-300px)] rounded-xl shadow-lg p-4 overflow-y-auto ">                                  
                <Routes path="/*">
                  <Route path="/" element={<WelcomePostman />} />
                  <Route path="/parcel" element={<ParcelPage />} />
                  <Route path="/createaccount" element={<CreateAdminAccount />} />
                  <Route path="/editparcel/" element={<EditParcel />} />
                </Routes>
            </div>
                </>

            }
        </div>
    )
}