
import { NavLink } from 'react-router-dom';

import { useEffect, useState } from 'react';
import logo from "../../../../assets/logo.png"
import AllPetsAdmin from './AllPetsAdmin';
import { AuthContext } from '../../../../components/providers/AuthProvider';
import { useContext } from 'react';

const AllPetsAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const{user}=useContext(AuthContext);
  const[isAdmin,setIsAdmin]=useState(false)

  useEffect(() => {
    fetch(`http://localhost:5007/users`)
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
      <li className="pt-4 "><NavLink to="/" className={({ isActive, isPending }) =>
        isPending ? "pending  text-white" : isActive ? "text-warning font-bold  underline underline-offset-8  hover:text-red " : ""
      }>Home</NavLink></li>
  
  
    </>
  return (
    <div className="grid grid-cols-4 min-h-screen">
    {/* Sidebar for large screens */}
    <aside className="hidden lg:flex col-span-1 bg-[#D52B5C] text-white flex-col py-8 px-4 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 pl-2">Menu</h2>
      <ul className="space-y-4">{navLinks}</ul>
    </aside>
  
    {/* Main content */}
    <main className="col-span-4 lg:col-span-3 bg-pink-50 relative">
      {/* Mobile nav dropdown */}
      <div className="lg:hidden flex justify-end p-4">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
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
          <ul className="menu dropdown-content mt-3 z-10 p-3 shadow-lg bg-white rounded-box w-56 text-gray-700">
            {navLinks}
          </ul>
        </div>
      </div>
  
      {/* Dashboard header */}
      <header className="bg-warning rounded-b-3xl py-10 shadow-inner">
        <h1 className="text-4xl font-bold text-center text-[#3f3f3f] border-y-4 w-11/12 md:w-2/5 mx-auto py-2">
          Admin Dashboard
        </h1>
      </header>
  
      {/* Dashboard content */}
      <section className="p-6 sm:p-10">
        <AllPetsAdmin />
      </section>
    </main>
  </div>
  
  );
};

export default AllPetsAdminDashboard;