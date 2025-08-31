import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import ForgetPassword from "./forgetPassword";
import { useGoogleLogin } from "@react-oauth/google";

function LoginPage(){
    const location = useLocation();
    const initialEmail = location.state?.email || "";
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("")
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();
    const [modalIsOpen, setIsOpen] = useState(false);
    
    function openModal() {
        setIsOpen(true);
    }
    
    function closeModal() {
        setIsOpen(false);
    }

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

    const googleLogin  = useGoogleLogin({
        onSuccess: (response)=>{
            const accessToken = response.access_token
            axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/login/google", {
                accessToken: accessToken
            }).then((response)=>{
                toast.success("Login Successful")
                const token = response.data.token
                localStorage.setItem("token", token)
                if(response.data.role === "admin"){
                    navigate("/admin")
                }
                else if(response.data.role === "postman"){
                    navigate("/postman")
                }
                else{
                    navigate("/home")
                }
            })
        }
    })

    const handleClick = () => {
        setShowSpinner(true);
        handleLogin();
    };

    return (
        <div className='w-full min-h-screen flex flex-col lg:flex-row relative overflow-hidden'>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-red-800 to-pink-800"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 hidden lg:block">
                <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Left Side - Welcome Section */}
            <div className="w-full lg:w-1/2 min-h-[40vh] lg:h-screen flex items-center justify-center relative">
                <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-8 lg:gap-12 py-8 lg:py-0">
                    <h1 className="text-white text-4xl lg:text-7xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
                        Welcome Back
                    </h1>
                    <div className="text-center text-white space-y-4 lg:space-y-6">
                        <h2 className="text-2xl lg:text-4xl font-semibold mb-2 lg:mb-4">Track Your Packages</h2>
                        <p className="text-base lg:text-xl opacity-90 max-w-md mx-auto leading-relaxed px-4 lg:px-0">
                            Get real-time updates on your deliveries from all major carriers in one place
                        </p>
                        <div className="grid grid-cols-1 gap-4 mt-8 max-w-sm mx-auto">
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 transform hover:scale-105 transition-transform duration-300">
                                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                                <span className="text-sm">Real-Time Tracking</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 transform hover:scale-105 transition-transform duration-300">
                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                <span className="text-sm">Multiple Carriers</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 transform hover:scale-105 transition-transform duration-300">
                                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                <span className="text-sm">Instant Notifications</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className='w-full lg:w-1/2 flex justify-center items-center relative  px-4 py-6 lg:py-0 lg:px-0'>
                <div className="w-full max-w-[400px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-xl flex flex-col justify-center items-center p-4 lg:p-6 relative">
                    
                    {/* Loading Overlay */}
                    {showSpinner && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-50">
                            <div className="text-center">
                                <VscLoading className="text-white text-4xl animate-spin mx-auto mb-3" />
                                <p className="text-white text-sm">Signing you in...</p>
                            </div>
                        </div>
                    )}

                    <div className="w-full text-center mb-4 lg:mb-6">
                        <h1 className='text-xl lg:text-3xl font-bold text-white mb-2'>Login</h1>
                        <p className="text-white/80 text-xs lg:text-sm">Welcome back! Please sign in to continue</p>
                    </div>              
                    
                    <div className="w-full space-y-3 lg:space-y-4">
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            value={email}
                            placeholder='Email' 
                            className='w-full h-9 lg:h-11 px-3 lg:px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300'
                        />
                        <input 
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            value={password}
                            placeholder='Password' 
                            className='w-full h-9 lg:h-11 px-3 lg:px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300'
                        />
                    </div>

                     <div className="w-full text-right mb-4 lg:mb-6">
                        <button className="text-pink-300 hover:text-pink-200 text-xs lg:text-sm font-semibold transition-colors duration-300 focus:outline-none cursor-pointer" onClick={openModal}>Forgot password?</button>
                    </div>

                    <div className="w-full space-y-4">
                        <button 
                            onClick={handleClick}
                            className='w-full h-9 lg:h-11 bg-gradient-to-r cursor-pointer from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none'
                        >
                            Sign In
                        </button>

                        {/* Divider */}
                        <div className="flex items-center my-4">
                            <div className="flex-1 border-t border-white/30"></div>
                            <span className="px-4 text-white/70 text-xs lg:text-sm">or</span>
                            <div className="flex-1 border-t border-white/30"></div>
                        </div>

                        {/* Google Sign In Button */}
                        <button 
                            onClick={googleLogin}
                            className='w-full h-9 lg:h-11 bg-white/20 backdrop-blur-sm cursor-pointer border border-white/30 hover:bg-white/30 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3 focus:outline-none'
                        >
                            <FcGoogle className="text-xl lg:text-2xl"/>
                            <span>Sign in with Google</span>
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className='text-center mt-6'>
                        <p className='text-white/90 text-xs lg:text-sm'>
                            Don't have an account?
                            <Link 
                                to={"/Register"} 
                                className='ml-2 text-pink-300 hover:text-pink-200 font-semibold transition-colors duration-300 hover:underline'
                                style={{textDecoration: "none"}}
                            > 
                                Register
                            </Link>
                        </p>
                    </div>
                    {/* Modal should be outside the button div for proper overlay */}
                    <ForgetPassword isOpen={modalIsOpen} onRequestClose={closeModal}/>
                </div>
            </div>
        </div>
    );
} 

export default LoginPage;