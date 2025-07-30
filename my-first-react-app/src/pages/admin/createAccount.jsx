import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useLocation, useNavigate } from "react-router-dom";

export default function CreateAdminAccount() {
    const location = useLocation();
    const initialEmail = location.state?.email || "";
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        name: "",
        email: initialEmail,
        address: "",
        phoneNumber: "",
        role: "",
        password: "",
        confirmPassword: ""
    });
    
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleRegister() {
        console.log("Password:", formData.password);
        console.log("Confirm:", formData.confirmPassword);
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/", {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            role: formData.role,
            phoneNumber: formData.phoneNumber,
            password: formData.password
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            toast.success("Registration successful!");
            navigate("/admin/users");
        })
        .catch((err) => {
            console.error("Registration failed:", err);
            toast.error(err.response?.data?.message || "Registration failed");
        });
    }

    function handleClear() {
        setFormData({
            name: "",
            email: "",
            address: "",
            phoneNumber: "",
            role: "", 
            password: "",
            confirmPassword: ""
        });
    }


    return (
        <div className='w-full bg-white h-screen flex'>
            <div className='w-full h-full flex justify-center items-center'>
                <div className="w-[500px] h-[650px] backdrop-blur-xl shadow-xl rounded-lg flex flex-col justify-center items-center bg-red-900 p-4">
                    <div className="w-full h-[15%] flex justify-center">
                        <h1 className='text-5xl font-bold text-green-400 font-mono italic mb-4'>Create Account</h1>
                    </div>

                    {/* Form Fields */}
                    <input name="name" value={formData.name} onChange={handleChange}
                        type="text" placeholder='Name'
                        className='border border-white rounded-xl text-center bg-white mb-4'
                        style={{ width: '400px', height: '40px' }}
                    />
                    <input name="email" value={formData.email} onChange={handleChange}
                        type="email" placeholder='Email'
                        className='border border-white rounded-xl text-center bg-white mb-4'
                        style={{ width: '400px', height: '40px' }}
                    />
                    <input name="address" value={formData.address} onChange={handleChange}
                        type="text" placeholder='Address'
                        className='border border-white rounded-xl text-center bg-white mb-4'
                        style={{ width: '400px', height: '40px' }}
                    />
                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                        type="text" placeholder='Phone Number'
                        className='border border-white rounded-xl text-center bg-white mb-4'
                        style={{ width: '400px', height: '40px' }}
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-[400px] h-[40px] border border-gray-500 rounded-xl text-center m-[10px] bg-white mb-4"
                    >
                        <option value="" disabled>Select status</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <input name="password" value={formData.password} onChange={handleChange}
                        type="password" placeholder='Password'
                        className='border border-white rounded-xl text-center bg-white mb-4'
                        style={{ width: '400px', height: '40px' }}
                    />
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                        type="password" placeholder='Confirm Password'
                        className='border border-white rounded-xl text-center bg-white mb-5'
                        style={{ width: '400px', height: '40px' }}
                    />

                    {/* Register Button */}
                    <button onClick={handleRegister}
                        className='bg-blue-500 hover:bg-blue-600 text-white rounded-xl'
                        style={{ marginTop: '10px', width: '400px', height: '45px' }}
                    >
                        Register
                    </button>

                    <button
                        onClick={handleClear}
                        className="bg-gray-500 hover:bg-gray-600 text-white rounded-xl mt-2 mb-3"
                        style={{ width: '400px', height: '45px' }}
                    >
                    Clear
                    </button>

                </div>
            </div>
        </div>
    );
}