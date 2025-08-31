import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import ForgetPassword from "./forgetPassword";

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

    function handleGoogleLogin() {
        // Implement Google OAuth login here
        console.log("Google login clicked");
        // You can integrate with Google OAuth API here
    }

    const handleClick = () => {
        setShowSpinner(true);
        handleLogin();
    };

    return(
        <div className='w-full h-screen flex relative overflow-hidden'>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-red-800 to-pink-800"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Left Side - Welcome Section */}
            <div className="w-[50%] h-full flex items-center justify-center relative">
                <div className="w-full h-full flex flex-col">
                    <div className="w-full h-1/3 flex items-center justify-center">
                        <h1 className="text-white text-7xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
                            Welcome
                        </h1>
                    </div>
                    <div className="w-full h-2/3 flex items-center justify-center">
                        <div className="text-center text-white space-y-6">
                            <h2 className="text-4xl font-semibold mb-4">Track Your Packages</h2>
                            <p className="text-xl opacity-90 max-w-md mx-auto leading-relaxed">
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
            </div>

            {/* Right Side - Login Form */}
            <div className='w-[50%] h-full flex justify-center items-center relative'>
                <div className="w-[450px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl flex flex-col justify-center items-center p-8 relative">
                    
                    {/* Loading Overlay */}
                    {showSpinner && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
                            <div className="text-center">
                                <VscLoading className="text-white text-6xl animate-spin mx-auto mb-4" />
                                <p className="text-white text-lg">Signing you in...</p>
                            </div>
                        </div>
                    )}

                    <div className="w-full text-center mb-8">
                        <h1 className='text-5xl font-bold text-white mb-2'>Login</h1>
                        <p className="text-white/80 text-lg">Welcome back! Please sign in to continue</p>
                    </div>              
                    
                    <div className="w-full space-y-4 mb-2">
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            value={email}
                            placeholder='Email' 
                            className='w-full h-14 px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300'
                        />
                        <input 
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            value={password}
                            placeholder='Password' 
                            className='w-full h-14 px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300'
                        />
                    </div>

                     <div className="w-full text-right  mb-6">
                        <button className="ml-2 text-pink-300 hover:text-pink-200 font-semibold transition-colors duration-300  focus:outline-none cursor-pointer" onClick={openModal}>Forgot password</button>
                    </div>

                    <div className="w-full space-y-4">
                        <button 
                            onClick={handleClick}
                            className='w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none'
                        >
                            Sign In
                        </button>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-white/30"></div>
                            <span className="px-4 text-white/70 text-sm">or</span>
                            <div className="flex-1 border-t border-white/30"></div>
                        </div>

                        {/* Google Sign In Button */}
                        <button 
                            onClick={handleGoogleLogin}
                            className='w-full h-14 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3  focus:outline-none'
                        >

                            <span className="flex items-center cursor-pointer"><FcGoogle className="text-3xl mr-3"/>Continue with Google</span>
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className='text-center mt-8'>
                        <p className='text-white/90 text-base'>
                            Don't have an account?
                            <Link 
                                to={"/Register"} 
                                className='ml-2 text-pink-300 hover:text-pink-200 font-semibold transition-colors duration-300 hover:underline'
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
    )
} 

export default LoginPage;