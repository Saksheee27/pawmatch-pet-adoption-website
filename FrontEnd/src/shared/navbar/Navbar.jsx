import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { CiLogin } from "react-icons/ci";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/providers/AuthProvider";
import { MdArrowDropDown } from "react-icons/md";

// import icon from '../../assets/user.png';

const Navbar = ({ children }) => {
  const { user, logOut } = useContext(AuthContext);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);

    // Add an event listener to handle scroll position
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [theme]);

  const handleScroll = () => {
    // Check if the user has scrolled down, and set isScrolled accordingly
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };
  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  const handleSignOut = () => {
    logOut().then().catch();
  };
  // The class to apply when the user has scrolled down
  const navbarClass = isScrolled ? "fixed top-0 left-0 right-0" : "";
  const containerClass = isScrolled ? "py-3" : "";
  const darkThemeClass = theme === "dark" ? "bg-gray-900" : "bg-white";

  const navLinks = (
    <>
      <li className=" ">
        <NavLink
          to="/"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending "
              : isActive
              ? " text-[#fff] font-bold  rounded-3xl bg-[#D52B5C] px-6 py-2 underline-offset-8  hover:text-red "
              : ""
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/petlisting"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending"
              : isActive
              ? "text-[#fff] font-bold rounded-3xl bg-[#D52B5C] px-6 py-2   underline-offset-8 hover:text-red  "
              : ""
          }
        >
          Pet Listing
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/donationcampaign"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending"
              : isActive
              ? "text-[#fff] font-bold rounded-3xl bg-[#D52B5C] px-6 py-2   underline-offset-8 hover:text-red  "
              : ""
          }
        >
          Donation Campaigns
        </NavLink>
      </li>
    </>
  );
  return (
    <div className={`drawer drawer-end z-40 ${containerClass}`}>
    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
    <div className={`drawer-content flex flex-col ${navbarClass}`}>
      <div className={`w-full shadow-md ${darkThemeClass}`}>
        <div className="navbar max-w-[1200px] mx-auto px-4 py-3">
          {/* Mobile menu button */}
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>

          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-12" />
            <span className="text-2xl font-bold">Paw Match</span>
          </div>

          {/* Nav Links (desktop) */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="menu menu-horizontal gap-6">{navLinks}</ul>
          </div>

          {/* Theme toggle & user controls */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <label className="swap swap-rotate">
              <input type="checkbox" onChange={handleToggle} />
              <svg className="swap-on w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.64,17l-.71.71...Z" />
              </svg>
              <svg className="swap-off w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1...Z" />
              </svg>
            </label>

            {/* Display name */}
            {user && <p className="hidden md:block font-semibold">{user.displayName}</p>}

            {/* User dropdown */}
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <MdArrowDropDown size={24} />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-4 shadow-lg bg-white text-black rounded-box w-60 z-50"
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="avatar mb-2">
                      <div className="w-10 rounded-full bg-gray-300"></div>
                    </div>
                    <span className="font-semibold">{user.displayName}</span>
                  </div>
                  <li><Link to="/userdashboard">Dashboard</Link></li>
                  <li>
                    <button onClick={handleSignOut} className="text-[#D52B5C] font-bold flex items-center justify-between w-full">
                      Log Out <CiLogin size={18} />
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login">
                <button className="btn bg-[#D52B5C] text-white">Login</button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>

    {/* Mobile drawer menu */}
    <div className="drawer-side z-50">
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
      <ul className="menu p-4 w-72 min-h-full bg-base-200 space-y-3">
        {navLinks}
        <div className="mt-4 flex items-center gap-3">
          <CiLogin size={22} />
          {user ? (
            <button
              onClick={handleSignOut}
              className="btn bg-[#D52B5C] text-white w-full"
            >
              Log Out
            </button>
          ) : (
            <Link to="/login">
              <button className="btn bg-[#D52B5C] text-white w-full">Login</button>
            </Link>
          )}
        </div>
      </ul>
    </div>
  </div>

  );
};

export default Navbar;
