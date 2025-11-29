import { NavLink } from "react-router-dom";

import { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import Navbar from "../../shared/navbar/Navbar";
import { AuthContext } from "../../components/providers/AuthProvider";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5007/users`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(data);
        setLoading(false); // Set loading to false when data is loaded
      })
      .catch((error) => {
        console.error("Error fetching my added users:", error);
        setLoading(false); // Set loading to false even in case of an error
      });
  }, []);

  useEffect(() => {
    // Find the user based on the email
    const result = users.find((us) => us?.email === user?.email);
    
    console.log("User Found:", result);
    
    // Check if the found user has the role of "Admin"
    const admin = result?.role === "Admin";
    
    console.log("Is Admin:", admin);
    
    // Set the state to true if admin, false otherwise
    setIsAdmin(admin);
  }, [users, user]);

  if (loading) {
    // Show a loading spinner or message while waiting for data
    return (
      <>
        <div className=" h-[80vh] flex justify-center items-center">
          <div className=" rounded-md h-12 w-12 border-4 border-t-4 border-pink-600 animate-spin "></div>
          ;
        </div>
      </>
    );
  }
  // console.log(users);
  //  console.log('dedd',users.role,users.email);
  //  const isAdmin = users.some(user => user.role === 'Admin');
  //  console.log('adminnnn',isAdmin);
  const navLinks = (
    <>
      <div className="flex flex-col items-center mb-5">
        <div className=" bg-white rounded-full p-5 w-24">
          {" "}
          <img src={logo} alt="" />
        </div>
        <div className="  text-2xl font-bold ">Paw Match</div>
      </div>
      {isAdmin && (
        <>
          <li>
            <NavLink
              to="/allusers"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending text-white"
                  : isActive
                  ? "text-warning  text-lg font-bold underline underline-offset-8 hover:text-red  "
                  : ""
              }
            >
              All Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/allpetsadmin"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending text-white"
                  : isActive
                  ? "text-warning font-bold underline underline-offset-8 hover:text-red  "
                  : ""
              }
            >
              All Pets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/alldonationcampadmin"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending text-white"
                  : isActive
                  ? "text-warning font-bold underline underline-offset-8 hover:text-red  "
                  : ""
              }
            >
              All Donation Campaign
            </NavLink>
          </li>
          <div className=" divider text-white"></div>
        </>
      )}
      <li>
        <NavLink
          to="/addpet"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending  text-white"
              : isActive
              ? "text-warning  font-bold underline underline-offset-8 hover:text-red  "
              : ""
          }
        >
          Add a Pet
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/myaddedpets"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending  text-white"
              : isActive
              ? "text-warning font-bold  underline underline-offset-8 hover:text-red  "
              : ""
          }
        >
          My Added Pets
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/adoptionreq"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending text-white"
              : isActive
              ? "text-warning font-bold  underline underline-offset-8 hover:text-red  "
              : ""
          }
        >
          Adoption Request
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/createdonationcamp"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending text-white"
              : isActive
              ? "text-warning font-bold  underline underline-offset-8 hover:text-red  "
              : ""
          }
        >
          Create Donation Campaigns
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/mydonationcamp"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending text-white"
              : isActive
              ? "text-warning font-bold  underline underline-offset-8 hover:text-red  "
              : ""
          }
        >
          My Donation Campaign
        </NavLink>
      </li>
      <hr />
      <li className="pt-4 ">
        <NavLink
          to="/"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending  text-white"
              : isActive
              ? "text-warning font-bold  underline underline-offset-8  hover:text-red "
              : ""
          }
        >
          Home
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="grid grid-cols-4 pt-20">
        {/* Sidebar */}
        <div className="min-h-[80vh] bg-[#D52B5C] col-span-1 hidden lg:flex flex-col items-start p-6 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Dashboard Menu</h2>
          <ul className="space-y-4 w-full">{navLinks}</ul>
        </div>

        {/* Main Content */}
        <div className="min-h-screen bg-pink-100 lg:col-span-3 col-span-4 p-6">
          {/* Mobile Dropdown Menu */}
          <div className="dropdown absolute mt-6 left-6 z-10 lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-outline btn-pink shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-white rounded-box w-52 text-black">
              {navLinks}
            </ul>
          </div>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl text-white py-10 mb-12 shadow-md">
  {/* Conditionally render the text based on the user's role */}
  <p className="text-center text-4xl font-bold border-y-4 border-white w-fit mx-auto px-6 py-2 rounded-md">
  {isAdmin ? (
  <div>👑 Admin Dashboard</div>
) : (
  <div>👤 User Dashboard</div>
)}

  </p>
</div>

          {/* Welcome Message */}
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="text-2xl lg:text-3xl font-bold text-gray-800 text-center">
              🎉 Welcome to your dashboard, {user?.displayName || "User"}!
            </p>
            <p className="text-md text-gray-600 mt-4 text-center w-11/12 md:w-7/12">
              Here you can manage your pet listings, view adoption requests, and
              keep your profile up to date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
