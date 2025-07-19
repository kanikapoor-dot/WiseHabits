import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const showLogin = currentPath !== "/login";
  const showRegister = currentPath !== "/register";

  let gradientColor = "bg-linear-to-bl from-primary to-secondary";
  let gradientHoverBg = "hover:bg-linear-to-bl from-primary to-secondary";

  return (
    <nav className=" shadow bg-white mb-5 p-2 flex justify-between items-center">
      <Link
        to="/"
        className={`text-3xl ml-2 bg-clip-text ${gradientColor} text-transparent font-bold`}
      >
        WiseHabits
      </Link>
      <div className="text-center text-gray-700">
        {showLogin && (
          <Link
            to="/login"
            className={` ${gradientHoverBg} hover:text-white px-4 py-2 rounded-4xl transition`}
          >
            Login
          </Link>
        )}
        {showRegister && (
          <Link
            to="/register"
            className={` ${gradientHoverBg} hover:text-white px-4 py-2 rounded-4xl transition`}
          >
            Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
