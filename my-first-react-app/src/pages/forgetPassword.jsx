import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 0,
    borderRadius: "20px",
    background:"black",
    border:"none"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(4px)",
  }
};

function ForgetPassword({ isOpen, onRequestClose }) {

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);
  
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
 


 async function sendOtp() {
  try {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/send-otp", {
      email: email,
    });
    setOtpSent(true);
    toast.success("OTP is successfully sent to your email");
    console.log(response.data);
    setEmail("");
  } catch (error) {
    console.log(error);
    setEmail("");

  }
}

  function verifyOtp() {
    const numOtp = parseInt(otp, 10);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/reset-password", {
        email: email,
        otp: numOtp,
        newPassword: newPassword,
      })
      .then((response) => {
        toast.success("OTP verified Successfully!");
        console.log(response.data);
        setOtpSent(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Invalid OTP");
      });
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Forget Password"
      >
        <div className="flex flex-col justify-center items-center">
          {otpSent ? (
            <div className="w-[400px] h-[400px]  shadow-2xl rounded-xl flex flex-col justify-center items-center p-4 bg-gradient-to-br from-gray-800 via-red-800 to-pink-800">
              <input
                type="text"
                placeholder="Enter your OTP"
                className="w-full h-12 px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl mb-5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Enter New Password"
                className="w-full h-12 px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl mb-5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full h-12 px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl mb-5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              <div className="flex space-x-4 mt-3">
                <button
                  className="w-[150px] h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer focus:outline-none"
                  onClick={() => {
                    verifyOtp();
                  }}
                >
                  Verify OTP
                </button>
                <button
                  className="w-[150px] h-14 bg-gray-300 text-gray-700 font-semibold rounded-xl mb-4 hover:bg-gray-400 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
                    onClick={() => {
                      setOtpSent(false);
                      onRequestClose();
                    }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="w-[400px] h-[400px]  shadow-2xl rounded-xl flex flex-col justify-center items-center p-4 bg-gradient-to-br from-gray-800 via-red-800 to-pink-800">
              <h1 className="text-4xl font-bold mb-15 text-white">Reset Password</h1>
              <input
                type="email"
                placeholder="Enter your email here..."
                className="w-full h-14 px-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl mb-5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                className={`w-[50%] h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer focus:outline-none ${loading ? "opacity-60 cursor-not-allowed hover:scale-none" : ""}`}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await sendOtp();
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ForgetPassword;
