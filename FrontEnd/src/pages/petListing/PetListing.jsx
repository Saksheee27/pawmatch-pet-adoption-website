/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import PetListingCard from "./PetListingCard";
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from "../../shared/navbar/Navbar";

const PetListing = () => {
  const [pets, setPets] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemsToShow, setItemsToShow] = useState(10); // Initial number of items to show
  const [filteredPets, setFilteredPets] = useState([]); // New state for filtered pets

  useEffect(() => {
    fetchPets();
  }, [selectedCategory, itemsToShow]);

  useEffect(() => {
    // Update filtered pets when the main pet list changes or when the category changes
    filterPetsByCategory();
  }, [pets, selectedCategory]);

  const filterPetsByCategory = () => {
    // If no category is selected, show all pets
    if (!selectedCategory) {
      setFilteredPets(pets);
    } else {
      // Filter pets based on the selected category
      const filtered = pets.filter((pet) => pet.category === selectedCategory);
      setFilteredPets(filtered);
    }
  };

  const fetchPets = () => {
    const fetchLimit = itemsToShow;

    // Include category parameter only if selectedCategory is not empty
    const categoryParam = selectedCategory
      ? `&category=${selectedCategory}`
      : "";

    fetch(`http://localhost:5007/pets?limit=${fetchLimit}${categoryParam}`)
      .then((response) => response.json())
      .then((data) => {
        // Sort the data by addedDate in descending order
        const sortedData = data.sort(
          (a, b) => new Date(b.addedDate) - new Date(a.addedDate)
        );

        setPets(sortedData);
        setHasMore(sortedData.length === fetchLimit);
      })
      .catch((error) => {
        console.error("Error fetching pets:", error);
        setHasMore(false);
      });
  };
  const handleScroll = () => {
    setItemsToShow((prevItems) => prevItems + 10);
  };

  const handleSearch = () => {
    // Simulate searching (replace with your actual search logic)
    // Note: Adjust the search logic as needed for your application
    const filteredPets = pets.filter((pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPets(filteredPets);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    // Trigger search as the user types
    handleSearch();
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    // Fetch new pets when the category changes
    fetchPets();
  };

  return (
    <div className="min-h-screen bg-gray-50">
  <Navbar />

  {/* Header */}
  <div className="text-center my-12">
    <p className="text-4xl font-bold border-y-4 border-pink-400 inline-block py-3 px-6 text-gray-800">
      🐶 Pet List 🐱
    </p>
  </div>

  {/* Filter/Search Section */}
  <div className="w-full flex justify-center px-4">
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by pet name"
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="w-full md:w-1/2 rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
      />

      {/* Category */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full md:w-1/3 rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
      >
        <option value="">All Categories</option>
        <option value="Cat">Cat</option>
        <option value="Dog">Dog</option>
        <option value="Bird">Bird</option>
        <option value="Fish">Fish</option>
        <option value="Rabbit">Rabbit</option>
        <option value="Turtle">Turtle</option>
        <option value="Hamster">Hamster</option>
        <option value="Other">Other</option>
      </select>
    </div>
  </div>

  {/* Infinite Scroll Grid */}
  <InfiniteScroll
    dataLength={filteredPets.length}
    next={handleScroll}
    hasMore={hasMore}
    loader={
      <div className="h-[80vh] flex justify-center items-center">
        <div className="rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent animate-spin" />
      </div>
    }
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-16 lg:px-24 py-12">
      {filteredPets.map((card, index) => (
        <PetListingCard key={`${card._id}-${index}`} card={card} />
      ))}
    </div>
  </InfiniteScroll>
</div>

  );
};

export default PetListing;
