import { useState, useEffect } from 'react';
import axios from 'axios';

const Checkout = () => {
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    deliveryFee: 5,
    total: 0,
  });

  useEffect(() => {
    fetchCartTotals();
  }, []);

  const fetchCartTotals = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/orders/calculate-total');
      setCartTotals({
        subtotal: res.data.subtotal,
        deliveryFee: res.data.deliveryFee,
        total: res.data.total,
      });
    } catch (err) {
      console.error('Error fetching cart totals:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders/', deliveryInfo);
      window.location.href = '/payment';
    } catch (err) {
      alert('Error submitting delivery info: ' + err.message);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md flex gap-8">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              value={deliveryInfo.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="lastName"
              value={deliveryInfo.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="border p-2 rounded"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={deliveryInfo.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="text"
            name="street"
            value={deliveryInfo.street}
            onChange={handleChange}
            placeholder="Street"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="city"
              value={deliveryInfo.city}
              onChange={handleChange}
              placeholder="City"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="state"
              value={deliveryInfo.state}
              onChange={handleChange}
              placeholder="State"
              className="border p-2 rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="zip"
              value={deliveryInfo.zip}
              onChange={handleChange}
              placeholder="Zip code"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="country"
              value={deliveryInfo.country}
              onChange={handleChange}
              placeholder="Country"
              className="border p-2 rounded"
              required
            />
          </div>
          <input
            type="text"
            name="phone"
            value={deliveryInfo.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button type="submit" className="bg-orange-500 text-white px-6 py-3 rounded w-full">Proceed to Payment</button>
        </form>
      </div>

      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-6">Cart Totals</h2>
        <div className="flex justify-between mb-2">
          <p>Subtotal</p>
          <p>${cartTotals.subtotal}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Delivery Fee</p>
          <p>${cartTotals.deliveryFee}</p>
        </div>
        <div className="flex justify-between font-bold">
          <p>Total</p>
          <p>${cartTotals.total}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;