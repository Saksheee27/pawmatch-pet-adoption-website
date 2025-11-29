import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../components/providers/AuthProvider';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import './MyAddedPets.css'; // You can create a CSS file for styling pagination

const MyAddedPets = () => {
  const { user } = useContext(AuthContext);

  const [filteredPets, setFilteredPets] = useState([]);
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const petsPerPage = 10;
  const pagesVisited = currentPage * petsPerPage;

  useEffect(() => {
    fetch(`http://localhost:5007/pets`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched pets:', data);
        setPets(data);
      })
      .catch(error => console.error('Error fetching my added pets:', error));
  }, []);

  useEffect(() => {
    user &&
      user?.email &&
      setFilteredPets(pets.filter(pet => pet.userEmail === user?.email));
  }, [pets, user]);

  const deletePet = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5007/pets/${_id}`, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(data => {
            console.log('Pet deleted successfully:', data);
            setPets(prevPets => prevPets.filter(pet => pet._id !== _id));
          })
          .catch(error => console.error('Error deleting pet:', error));
      }
    });
  };

  const adoptPet = (_id) => {
    const pet = pets.find((pet) => pet._id === _id);

    if (pet && !pet.adopted) {
      fetch(`http://localhost:5007/pets/${_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adopted: true }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Pet adopted successfully:', data);
          setPets(prevPets =>
            prevPets.map(pet =>
              pet._id === _id ? { ...pet, adopted: true } : pet
            )
          );
        })
        .catch(error => console.error('Error adopting pet:', error));
    }
  };

  const pageCount = Math.ceil(filteredPets.length / petsPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayPets = filteredPets
    .slice(pagesVisited, pagesVisited + petsPerPage)
    .map((pet, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <div className='flex items-center gap-3'>
            <div className='avatar'>
              <div className='mask mask-squircle w-12 h-12'>
                <img src={pet.image} alt='Avatar Tailwind CSS Component' />
              </div>
            </div>
          </div>
        </td>
        <td>{pet.name}</td>
        <td>{pet.category}</td>
        <td>{pet.adopted ? 'Adopted' : 'Not Adopted'}</td>
        <td>
          <Link to={`../updatepet/${pet._id}`}>
            <button className='btn btn-warning btn-xs mr-5 text-white'>
              Update
            </button>
          </Link>
          <button
            className='btn btn-error btn-xs mr-5'
            onClick={() => deletePet(pet._id)}
          >
            Delete
          </button>
          {!pet.adopted && (
            <button
              className='btn btn-primary btn-xs'
              onClick={() => adoptPet(pet._id)}
            >
              Adopt
            </button>
          )}
        </td>
      </tr>
    ));

  if (!pets || pets.length === 0) {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <h2 className='text-center text-3xl font-bold'>
            You have not added any pet
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-20 py-10">
  {/* Header */}
  <div className="flex flex-col lg:flex-row items-center justify-between border-b border-gray-300 pb-6 mb-10">
    <h1 className="text-3xl font-bold text-gray-800">My Added Pets</h1>
    <h2 className="text-xl font-semibold text-gray-600 mt-4 lg:mt-0">
      {filteredPets.length} Added Pet{filteredPets.length !== 1 && 's'}
    </h2>
  </div>

  {/* Pet Table or Message */}
  {filteredPets.length > 0 ? (
    <div>
      <div className="overflow-x-auto rounded-xl shadow-md bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-6 text-center">#</th>
              <th className="py-3 px-6 text-center">Image</th>
              <th className="py-3 px-6 text-center">Name</th>
              <th className="py-3 px-6 text-center">Category</th>
              <th className="py-3 px-6 text-center">Adoption Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white  text-center">{displayPets}</tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <ReactPaginate
          previousLabel={'← Previous'}
          nextLabel={'Next →'}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={'flex items-center space-x-2'}
          pageLinkClassName={
            'px-4 py-2 bg-white border rounded-md hover:bg-blue-100 text-gray-600'
          }
          previousLinkClassName={
            'px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
          }
          nextLinkClassName={
            'px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
          }
          activeLinkClassName={'bg-blue-500 text-white !hover:bg-blue-500'}
          disabledLinkClassName={'opacity-50 cursor-not-allowed'}
        />
      </div>
    </div>
  ) : (
    <div className="text-center mt-20">
      <p className="text-lg text-gray-500 font-medium">
        You haven't added any pets yet.
      </p>
    </div>
  )}
</div>

  );
};

export default MyAddedPets;
