import { useState, useEffect } from 'react';
import axios from 'axios';

const Payment = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    email: '',
    cardNumber: '',
    expiration: '',
    cvc: '',
    name: '',
    country: '',
  });

  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    fetchOrderTotal();
  }, []);

  const fetchOrderTotal = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/orders/calculate-total');
      setOrderTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching order total:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/payments/process-order', paymentInfo);
      alert('Payment successful!');
      window.location.href = '/success';
    } catch (err) {
      alert('Error processing payment: ' + err.message);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md flex gap-8">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-6">Pay with card</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={paymentInfo.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="text"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handleChange}
            placeholder="Card information"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="expiration"
              value={paymentInfo.expiration}
              onChange={handleChange}
              placeholder="MM/YY"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="cvc"
              value={paymentInfo.cvc}
              onChange={handleChange}
              placeholder="CVC"
              className="border p-2 rounded"
              required
            />
          </div>
          <input
            type="text"
            name="name"
            value={paymentInfo.name}
            onChange={handleChange}
            placeholder="Cardholder name"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="text"
            name="country"
            value={paymentInfo.country}
            onChange={handleChange}
            placeholder="Country or region"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded w-full">Pay</button>
        </form>
      </div>
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <p>Course</p>
          <p>₹{orderTotal}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>GST</p>
          <p>₹0</p>
        </div>
        <div className="flex justify-between font-bold">
          <p>Total</p>
          <p>₹{orderTotal}</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;