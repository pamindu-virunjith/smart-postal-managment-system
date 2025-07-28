import { Routes, Route, Link, useLocation } from "react-router-dom";

import { FaUsers } from "react-icons/fa";
import { MdOutlineWarehouse } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import '../App.css';
import ParcelPage from "./admin/parcel";
import AddParcel from "./admin/addParcel";
import EditParcel from "./admin/editParcel";
import UsersPage from "./admin/usersPage";


export default function AdminPage() {

    const location = useLocation();
    const path = location.pathname;


    return (
        <div className='w-full h-screen flex bg-gray-100 p-2'>
            <div className='h-full w-[300px] bg-red-200 rounded-xl shadow-lg p-4 flex flex-col mr-2'>
                <Link to ="/admin/users" className={`p-2 my-0.5 flex items-center text-xl hover:bg-red-300 rounded-xl ${path === "/admin/users" ? "bg-red-300" : ""}`} > <FaUsers className="mr-2 text-blue-700"/> Users</Link>
                <Link to ="/admin/parcel" className={`p-2 my-0.5 flex items-center text-xl hover:bg-red-300 rounded-xl ${path === "/admin/parcel" ? "bg-red-300" : ""}`} > <MdOutlineWarehouse className="mr-2 text-green-500"/> Parcel</Link>
                <Link to ="/admin/orders" className={`p-2 my-0.5 flex items-center text-xl hover:bg-red-300 rounded-xl ${path === "/admin/orders" ? "bg-red-300" : ""}`} > <LiaFileInvoiceSolid className="mr-2 text-rose-600"/> Orders</Link>
            </div>

            <div className="h-full bg-white w-[calc(100vw-300px)] rounded-xl shadow-lg p-4 overflow-y-auto">
                <Routes path="/*">
                    <Route path="/users" element={<UsersPage/>} />
                    <Route path="/parcel" element={<ParcelPage />} />
                    <Route path="/orders" element={<div>Orders</div>} />
                    <Route path="/addparcel" element={<AddParcel />} />
                    <Route path="/editparcel/" element={<EditParcel />} />`
                </Routes>
            </div>
        </div>
    )
}