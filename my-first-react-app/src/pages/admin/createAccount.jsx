import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <div className="w-full max-w-md bg-white/80 shadow-2xl rounded-2xl p-8 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-6 font-sans">Create Account</h1>
                <form className="w-full flex flex-col gap-4">
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="Name"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        type="text"
                        placeholder="Address"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        type="text"
                        placeholder="Phone Number"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="postman">Postman</option>
                        <option value="user">User</option>
                    </select>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type="password"
                        placeholder="Confirm Password"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 mt-2 transition"
                    >
                        Register
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg py-2 transition"
                    >
                        Clear
                    </button>
                    <Link
                        to={"/admin/"}
                        className="bg-black hover:bg-gray-800 text-white font-semibold rounded-lg py-2 flex items-center justify-center transition"
                    >
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    );
}