import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { FaCartPlus, FaCheck } from "react-icons/fa";

function Home({ imagePath, Name }) {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("mintomax");
  const [addedItemIndex, setAddedItemIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchProductsByCategory = async (category) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/category/${category}`
      );
      const data = await response.json();

      if (data && data.products) {
        return data.products;
      } else {
        console.error("Invalid data format:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const handleCategoryFilterChange = async (category, filter) => {
    let sortedItems = [];

    if (category) {
      setSelectedCategory(category);
      try {
        const products = await fetchProductsByCategory(category);
        sortedItems = products.slice(); // Create a shallow copy
      } catch (error) {
        console.error("Error fetching products by category:", error);
        return;
      }
    }

    if (filter) {
      setSelectedFilter(filter);

      // Sort the items based on the selected filter
      sortedItems.sort((a, b) => {
        if (filter === "mintomax") {
          return a.price - b.price;
        } else if (filter === "maxtomin") {
          return b.price - a.price;
        }
        return 0;
      });
    }

    setItems(sortedItems);
  };

  useEffect(() => {
    // Perform actions based on the updated selectedCategory and selectedFilter here
    console.log(selectedCategory);
    console.log(selectedFilter);
  }, [selectedCategory, selectedFilter]);
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data && data.products) {
          setItems(data.products);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error state here
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllProducts();
  }, []);  

  const handleAddToCart = (item, index) => {
    const isItemInCart = cart.find((cartItem) => cartItem.id === item.id);

    if (!isItemInCart) {
      setCart([...cart, { ...item, quantity: 1 }]);
      setAddedItemIndex(index); // Set the index of the last added item

      // Reset addedItemIndex after a delay (e.g., 2 seconds)
      setTimeout(() => {
        setAddedItemIndex(null);
      }, 2000);
    } else {
      // If item is already in the cart, update its quantity
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    }
  };
  const removeFromCart = (item) => {
    // Filter out the item to remove from the cart
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(updatedCart);
  };

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <div className="p-1">
        <Nav
          imagePath={imagePath}
          Name={Name}
          cart={cart}
          removeFromCart={removeFromCart}
          getTotalItems={getTotalItems}
          getTotalPrice={getTotalPrice}
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
        />
      </div>
      <strong className="text-3xl">
        {selectedCategory === null ? "All Products" : selectedCategory}
      </strong>

      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-200">
        {items.map((item, index) => (
          <div
            key={index}
            className=" cursor-pointer bg-white border border-gray-500 border-solid rounded-md overflow-hidden transition-transform transform hover:scale-105"
          >
            <div className="h-64 p-2">
              <img
                src={item.thumbnail}
                alt={`Item ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <strong className="text-2xl text-pink-700">{item.title}</strong>
              <br />
              <strong className="text-2xl text-pink-700">${item.price}</strong>
              <p
                className="description"
                style={{ maxHeight: "100px", overflow: "hidden" }}
              >
                {item.description}
              </p>
              <div className="button-container">
                <button
                  key={index}
                  onClick={() => handleAddToCart(item, index)}
                >
                  <div className="p-2 cursor-pointer bg-white border border-gray-500 border-solid rounded-md overflow-hidden transition-transform transform hover:scale-105 flex flex-row mt-2 ">
                    <strong>Add to Cart</strong>
                    <FaCartPlus color="#AA336A" size={30} />
                    {/* Show success icon only for the added item */}
                    {addedItemIndex === index && (
                      <FaCheck
                        color="green"
                        size={20}
                        style={{ marginLeft: "10px" }}
                      />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
