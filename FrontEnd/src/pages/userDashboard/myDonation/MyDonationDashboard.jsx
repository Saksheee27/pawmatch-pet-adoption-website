
import { NavLink } from 'react-router-dom';

import { useEffect, useState } from 'react';
import logo from "../../../assets/logo.png";
import MyDonation from './MyDonation';
import { AuthContext } from '../../../components/providers/AuthProvider';
import { useContext } from 'react';

const MyDonationDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const{user}=useContext(AuthContext);
  const[isAdmin,setIsAdmin]=useState(false)

  useEffect(() => {
    fetch(`https://pawmatch-server.vercel.app/users`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched users:', data);
        setUsers(data);
        setLoading(false); // Set loading to false when data is loaded
      })
      .catch(error => {
        console.error('Error fetching my added users:', error);
        setLoading(false); // Set loading to false even in case of an error
      });
  }, []);

  useEffect(()=>{
  // const result=users.find()
  const result=users.find((us) =>us?.email===user?.email)
  console.log('usersss',result);
  const admin=result?.role==='Admin';
  console.log('admin',admin);
  setIsAdmin(admin)
  },[users,user])
  

  if (loading) {
    // Show a loading spinner or message while waiting for data
    return <div className=" h-[80vh] flex justify-center items-center">
    <div className=" rounded-md h-12 w-12 border-4 border-t-4 border-pink-600 animate-spin "></div>;
    </div>;
  }
  // console.log(users);
  //  console.log('dedd',users.role,users.email);
  //  const isAdmin = users.some(user => user.role === 'Admin');
  //  console.log('adminnnn',isAdmin);
  const navLinks =
  <>
  <div className="flex flex-col items-center mb-5">
               <div className=" bg-white rounded-full p-5 w-24"> <img src={logo}  alt="" /></div>
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
        <div className=' divider text-white'></div>
      </>
    )}
      <li><NavLink to="/addpet" className={({ isActive, isPending }) =>
        isPending ? "pending  text-white" : isActive ? "text-warning  font-bold underline underline-offset-8 hover:text-red  " : ""
      }>Add a Pet</NavLink></li>
      <li><NavLink to="/myaddedpets" className={({ isActive, isPending }) =>
        isPending ? "pending  text-white" : isActive ? "text-warning font-bold  underline underline-offset-8 hover:text-red  " : ""
      }>My Added Pets</NavLink></li>
      <li><NavLink to="/adoptionreq" className={({ isActive, isPending }) =>
        isPending ? "pending text-white" : isActive ? "text-warning font-bold  underline underline-offset-8 hover:text-red  " : ""
      }>Adoption Request</NavLink></li>
      <li><NavLink to="/createdonationcamp" className={({ isActive, isPending }) =>
        isPending ? "pending text-white" : isActive ? "text-warning font-bold  underline underline-offset-8 hover:text-red  " : ""
      }>Create Donation Campaigns</NavLink></li>
      <li><NavLink to="/mydonationcamp" className={({ isActive, isPending }) =>
        isPending ? "pending text-white" : isActive ? "text-warning font-bold  underline underline-offset-8 hover:text-red  " : ""
      }>My Donation Campaign</NavLink></li>
      <li><NavLink to="/mydonation" className={({ isActive, isPending }) =>
        isPending ? "pending text-white" : isActive ? "text-warning font-bold  underline underline-offset-8 hover:text-red  " : ""
      }>My Donation </NavLink></li>
      <hr />
      <li className="pt-4 "><NavLink to="/" className={({ isActive, isPending }) =>
        isPending ? "pending  text-white" : isActive ? "text-warning font-bold  underline underline-offset-8  hover:text-red " : ""
      }>Home</NavLink></li>
  
  
    </>
  return (
<div className="min-h-screen grid grid-cols-4 bg-gray-100">

{/* Sidebar - Desktop Only */}
<div className="min-h-screen bg-[#D52B5C] col-span-1 hidden lg:flex flex-col p-6 text-white shadow-lg">
  <h2 className="text-2xl font-semibold mb-6">Menu</h2>
  <ul className="menu space-y-4">
    {navLinks.map((link, index) => (
      <li key={index} className="hover:bg-pink-600 p-2 rounded-md transition duration-300 ease-in-out hover:scale-105">
        <a href={link.href} className="text-lg font-medium">{link.name}</a>
      </li>
    ))}
  </ul>
</div>

{/* Main Content Area */}
<div className="col-span-4 lg:col-span-3 bg-pink-100 min-h-screen relative">
  
  {/* Mobile Dropdown Nav */}
  <div className="dropdown absolute top-6 left-6 z-20 lg:hidden">
    <div tabIndex={0} role="button" className="btn btn-sm btn-outline btn-pink">
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
    <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow-md bg-white rounded-box w-52 text-black">
      {navLinks.map((link, index) => (
        <li key={index} className="hover:bg-pink-600 p-2 rounded-md transition duration-300 ease-in-out">
          <a href={link.href} className="text-lg font-medium">{link.name}</a>
        </li>
      ))}
    </ul>
  </div>

  {/* Header */}
  <div className="h-40 bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center shadow-inner">
    <p className="text-3xl font-bold text-white border-y-4 border-white px-6 py-2 rounded-md text-center">
      📩 Adoption Requests
    </p>
  </div>

  {/* Main Content */}
  <div className="p-6 bg-white rounded-lg shadow-lg">
    <AdoptionReq />
  </div>
</div>
</div>


  );
};

export default MyDonationDashboard;