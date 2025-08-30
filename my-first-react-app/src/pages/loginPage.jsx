import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import React from "react";

function LoginPage(){
    const location = useLocation();
    const initialEmail = location.state?.email || "";
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("")
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();

    
    function handleLogin() {
        // console.log("Email:", email);
        // console.log("Password:", password);

        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
            email: email,
            password: password
        })
        .then((response) => {
            toast.success("Login successful!");

            // Extract token and user object
            const token = response.data.token;
            const user = response.data.user;

            // Save token and user email to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
                email: user.email,
                name: user.name,
                address: user.address
            }));

            // console.log(user.role);
            
            // Redirect based on user role
            switch (user.role?.toLowerCase()) {
                case "admin":
                    navigate("/admin");
                    break;
                case "postman":
                    navigate("/postman");
                    break;
                case "user":
                    navigate("/home");
                    break;
                default:
                    toast.error("Unknown role: " + user.role);
                    break;
            }

        })
        .catch((error) => {
            console.error("Login failed:", error);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
            setPassword("")
            setShowSpinner(false);
        });
    }

    const handleClick = () => {
        setShowSpinner(true);
        handleLogin();
    };

    return(
        <div className='w-full bg-white h-screen flex'>
            
            <div className="w-[50%] h-full flex items-center justify-center">
                <div className="w-full h-full flex flex-col">
                    <div className="w-full h-1/3 flex items-center justify-center">
                        <h1 className="text-pink-500 text-7xl font-mono">Welcome</h1>
                    </div>
                    <div className="w-full h-2/3 flex items-center justify-center">
                        <img className="max-h-full" src="/image-17.webp" alt="Login Background" />
                    </div>
                </div>
            </div>

            <div className='w-[50%] h-full flex justify-center items-center '>
                <div className="w-[450px] h-[600px] backdrop-blur-xl shadow-xl rounded-lg flex flex-col justify-center items-center bg-red-900">
                    <div className="w-full h-1/5 flex  justify-center">
                        <h1 className='text-6xl font-bold text-green-400 font-mono italic mb-6'>Login</h1>
                    </div>              
                    <input onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            value={email}
                            placeholder='Email' 
                            className='border border-white rounded-xl text-center bg-white mb-4' style={{ width: '400px', height: '50px' }}
                    />
                    <input onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            value={password}
                            placeholder='Password' 
                            className='border border-white rounded-xl text-center bg-white mb-6'style={{ width: '400px', height: '50px' }}
                    />
                    <button onClick={handleClick}
                        className='bg-blue-500 hover:bg-blue-600 text-white rounded-xl mb-2' style={{ marginTop: '20px', width: '400px', height: '50px' }}
                    >
                        Sign In
                    </button>
                    {showSpinner && (
                        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 bg-white/60">
                            <VscLoading className="text-[60px] animate-spin" />
                        </div>
                    )}
                    {/* Register */}
                    <p className='text-white text-base mt-4'>
                            Don't have an account?
                        &nbsp;
                        <span>
                            <Link to={"/Register"} className='cursor-pointer text-lg' style={{color:"yellow", textDecoration: "none"}}> Register</Link>
                        </span>
                    </p>
                    
                        
                </div>

            </div>

       
        </div>
    )
} 
export default LoginPage;