import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phoneNumber: "",
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
            phoneNumber: formData.phoneNumber,
            password: formData.password
        })
        .then((res) => {
            toast.success("Registration successful!");
            navigate("/login");
        })
        .catch((err) => {
            console.error("Registration failed:", err);
            toast.error(err.response?.data?.message || "Registration failed");
        });
    }

    return (
        <div className='w-full bg-white h-screen flex'>
            {/* Left Side Image/Welcome */}
            <div className="w-[50%] h-full flex items-center justify-center">
                <div className="w-full h-full flex flex-col">
                    <div className="w-full h-1/3 flex items-center justify-center">
                        <h1 className="text-pink-500 text-6xl font-mono">Join Us</h1>
                    </div>
                    <div className="w-full h-2/3 flex items-center justify-center">
                        <img className="max-h-full" src="/image-17.webp" alt="Register Background" />
                    </div>
                </div>
            </div>

            {/* Right Side Form */}
            <div className='w-[50%] h-full flex justify-center items-center'>
                <div className="w-[500px] h-[650px] backdrop-blur-xl shadow-xl rounded-lg flex flex-col justify-center items-center bg-red-900 p-4">
                    <div className="w-full h-[15%] flex justify-center">
                        <h1 className='text-5xl font-bold text-green-400 font-mono italic mb-4'>Register</h1>
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

                    {/* Submit Button */}
                    <button onClick={handleRegister}
                        className='bg-blue-500 hover:bg-blue-600 text-white rounded-xl'
                        style={{ marginTop: '10px', width: '400px', height: '45px' }}
                    >
                        Register
                    </button>

                    {/* Login link */}
                    <p className='text-white text-base mt-4'>
                        Already have an account? &nbsp;
                        <span>
                            <Link to={"/login"} className='cursor-pointer text-lg' style={{color:"yellow", textDecoration: "none"}}>Login</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
