import React, { useState, useEffect } from "react";
import { FaCartArrowDown, FaFilter, FaSearch, FaTrash } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { RiLogoutBoxLine } from "react-icons/ri";

function Nav({
  imagePath,
  Name,
  cart,
  removeFromCart,
  getTotalItems,
  getTotalPrice,
  onCategoryFilterChange,
  handlesearchedItem,
  selectedCategory: propSelectedCategory,
  selectedFilter: propSelectedFilter,

}) {
  const [categories, setCategories] = useState([]);
  const [Searchedthing, SetSearchedthing] = useState([]);
  const [VisibleSearching, SetVisibleSearching] = useState(false);
  const [SearchedWord, SetSearchedWord] = useState("");
  const [Cartopen, isCartOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(propSelectedCategory);
  const [selectedFilter, setSelectedFilter] = useState(propSelectedFilter);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    if (selectedCategory !== null && selectedFilter !== null) {
      onCategoryFilterChange(selectedCategory, selectedFilter);
    }
  }, [selectedCategory, selectedFilter, onCategoryFilterChange]);

  const Searching = async (event) => {
    SetSearchedWord(event.target.value);
    SetVisibleSearching(!VisibleSearching);
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${SearchedWord}`
      );
      const data = await response.json();

      if (data && data.products) {
        SetSearchedthing(data.products);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // Assuming data is an array of categories
        setCategories(data);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const Logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  const Opencart = () => {
    isCartOpen(!Cartopen);
  };
  return (
    <div>
      <div className="border-2 border-solid border-gray-300 bg-pink-700 p-4 flex gap-10 items-center justify-center text-center text-white relative">
        <div className="absolute left-10">
          <h1 className="text-2xl font-bold">E-Kart</h1>
          <label>Shopping with us</label>
        </div>
        <div className="flex items-center p-2 gap-2">
          <FaSearch size={20} />
          <input
            placeholder="Search"
            onChange={Searching}
            className=" text-black font-bold border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 w-72"
          />
          {!VisibleSearching && SearchedWord.trim() === "" ? null : (
            <div className="text-black border-2 border-solid border-gray-500 w-72 h-32 mt-40 absolute flex z-20 ml-7 bg-white shadow-md overflow-auto">
              <ul>
                {Searchedthing.map((product) => (
                  <li
                    className="text-pink-700 rounded-xl text-black hover:bg-pink-700 hover:text-white"
                    key={product.title}
                  >
                    <button onClick={() => handlesearchedItem(product.title)}>
                      <strong>{product.title}</strong>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative group">
          <button className="p-2 rounded-xl flex group-hover:bg-gray-800 group-focus:bg-gray-800 transition-all">
            <strong>Category</strong>
            <BsChevronDown size={20} />
          </button>
          <div className="border-2 rounded-md p-2 border-solid border-gray-500 w-40 h-auto absolute bg-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all z-10 h-40 overflow-auto">
            <ul className="font-bold">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="text-pink-700 rounded-xl text-black hover:bg-pink-700 hover:text-white"
                >
                  <button onClick={() => handleCategoryChange(category)}>
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative group">
          <button className=" rounded-xl flex group-hover:bg-gray-800 group-focus:bg-gray-800 transition-all p-2">
            <strong> Filter </strong>
            <FaFilter size={20} />
          </button>
          <div className="border-2 rounded-md p-2 border-solid border-gray-500 w-40 h-auto absolute bg-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all z-10">
            <ul className="font-bold">
              <li className=" text-pink-700 rounded-xl text-black hover:bg-pink-700 hover:text-white">
                <button onClick={() => handleFilterChange("mintomax")}>
                  Min. to Max.
                </button>
              </li>
              <li className=" text-pink-700 rounded-xl text-black hover:bg-pink-700 hover:text-white">
                <button onClick={() => handleFilterChange("maxtomin")}>
                  Max. to Min.
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex text-center items-center justify-center absolute right-10 p-1 gap-10">
          <button onClick={Opencart}>
            <label className="text-yellow-100">Items {getTotalItems()}</label>
            <FaCartArrowDown size={30} />
            <label> ${getTotalPrice()}</label>
          </button>
          <button>
            <div className="h-16 w-16 rounded-full border-2 border-white border-solid flex items-center justify-center">
              {imagePath && (
                <img src={imagePath} alt="User" className="rounded-full" />
              )}
            </div>
            <label>{Name}</label>
          </button>
          <button onClick={Logout}>
            <RiLogoutBoxLine size={30} />
            Logout
          </button>
        </div>
      </div>
      <div
        className={`border-2 border-gray-400 border-solid h-auto w-96 p-4 mt-0 right-0 absolute z-10 bg-white text-white ${
          Cartopen ? "" : "hidden"
        }`}
      >
        <strong className="text-gray-700 text-3xl underline">CART</strong>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty. Shop now!</p>
        ) : (
          cart.map((cartItem, index) => (
            <div
              key={index}
              className="w-full h-40 border-2 border-white rounded-xl border-solid flex items-center justify-center text-center bg-pink-700 mt-2 pl-4 pr-4"
            >
              <div className=" flex h-auto w-auto">
                <div className="w-40 h-32 border-2 border-white p-1 border-solid rounded-xl">
                  <img
                    src={cartItem.thumbnail}
                    alt={`Item ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full h-32 flex items-center justify-center text-center">
                  <div className="w-full h-32 text-xl p-4">
                    <strong>{cartItem.title}</strong>
                    <p>Price: ${cartItem.price}</p>
                    <p>Quantity: {cartItem.quantity}</p>
                  </div>
                  <div className="w-16 h-16 border-2 border-white rounded-xl border-dashed">
                    <button onClick={() => removeFromCart(cartItem)}>
                      <FaTrash size={40} className="mt-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Nav;
