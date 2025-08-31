import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    console.log("Signed out");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-white cursor-pointer hover:text-pink-300 transition-colors duration-200"
          onClick={() => navigate("/home")}
        >
          LOGO
        </div>
        <nav className="flex space-x-8">
          <button 
            onClick={() => navigate("/home")}
            className={`hover:text-pink-500 transition-colors duration-200 text-lg font-medium cursor-pointer focus:outline-none ${
              path == "/home" || path == "/"
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => navigate("/about")}
            className={`hover:text-pink-300 transition-all duration-200 text-lg font-medium cursor-pointer focus:outline-none ${
              path == "/about"
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            About
          </button>
          <button 
            onClick={() => navigate("/orders")}
            className={`hover:text-pink-300 transition-all duration-200 text-lg font-medium cursor-pointer focus:outline-none ${
              path == "/orders"
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            Orders
          </button>
          <button 
            onClick={handleSignOut}
            className={`hover:text-pink-300 transition-all duration-200 text-lg font-medium cursor-pointer focus:outline-none ${
              path == "/"
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;