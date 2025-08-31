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
    borderRadius: "15px",
  },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.3)",
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
 

  function sendOtp() {
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/send-otp", {
        email: email,
      })
      .then((response) => {
        setOtpSent(true);
        toast.success("OTP is successfully sent to your email");
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
          <div>
            <input
              type="text"
              placeholder="Enter your OTP"
              className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <button
              className="w-[50%] h-[50px] bg-blue-500 text-white font-bold rounded-lg mb-4 hover:bg-blue-400 transition-all duration-300 cursor-pointer"
              onClick={() => {
                verifyOtp();
              }}
            >
              Verify OTP
            </button>
            <button
              className="w-[50%] h-[50px] bg-gray-300 text-gray-700 font-bold rounded-lg mb-4 hover:bg-gray-400 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setOtpSent(false);
              }}
            >
              Cancle
            </button>
          </div>
        ) : (
          <div className="w-[400px] h-[400px] bg-white shadow-2xl rounded-xl flex flex-col justify-center items-center p-4">
            <h1 className="text-4xl font-bold mb-15">Reset Password</h1>
            <input
              type="email"
              placeholder="Enter your email here..."
              className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <button
              className="w-[50%] h-[50px] bg-blue-500 text-white font-bold rounded-lg mb-4 hover:bg-blue-600 transition-all duration-300 focus:outline-none cursor-pointer"
              onClick={() => {
                sendOtp();
              }}
            >
              Send OTP
            </button>
          </div>
        )}
        </div>
      </Modal>
    </div>
  );
}

export default ForgetPassword;
