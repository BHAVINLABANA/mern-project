import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

function Cart() {
  const [cart, setCart] = useState([]);
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart);
    } catch (error) {
      console.error(error);
    }
  };

  const increaseQuantity = async (item) => {
    try {
      await api.put(`/cart/${item._id}`, {
        quantity: item.quantity + 1,
      });

      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = async (item) => {
    try {
      await api.put(`/cart/${item._id}`, {
        quantity: item.quantity - 1,
      });

      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);

      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.error(error);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <h2 className="text-xl">Your cart is empty.</h2>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border rounded-lg p-4 mb-4 shadow-sm"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.product.images?.[0]?.url}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div>
                  <h2 className="text-xl font-bold">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-600">
                    ₹{item.product.price}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQuantity(item)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>

                    <span className="font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="mt-3 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-2xl font-bold">
                  ₹{item.product.price * item.quantity}
                </h2>
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-end">
            <div className="border rounded-lg p-6 w-80 shadow-md">
              <h2 className="text-2xl font-bold mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;