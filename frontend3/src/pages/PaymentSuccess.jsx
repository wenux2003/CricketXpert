const PaymentSuccess = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-6 text-primary">Payment Successful!</h2>
      <p className="text-textSoft mb-6">Your order has been placed. Thank you for your purchase.</p>
      <button onClick={() => window.location.href = '/'} className="bg-secondary text-white px-6 py-3 rounded">Return to Home</button>
    </div>
  );
};

export default PaymentSuccess;