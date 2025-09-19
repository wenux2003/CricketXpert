import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DeliveryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const quantity = location.state?.quantity ?? 1;

  const proceedToPayment = () => {
    navigate('/payment', { state: { product, quantity } });
  };

  if (!product) {
    return (
      <div className="bg-[#F1F2F7] min-h-screen text-[#36516C]">
        <Header />
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-white p-6 rounded shadow">No product selected. Redirecting...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C]">
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold text-[#000000] mb-4">Delivery</h2>
          <div className="flex items-center gap-4 mb-6">
            <img src={product.image_url || 'https://placehold.co/120'} alt={product.name} className="w-20 h-20 object-cover rounded" />
            <div>
              <div className="text-[#000000] font-semibold">{product.name}</div>
              <div className="text-sm text-gray-600">Qty: {quantity}</div>
            </div>
          </div>
          <button
            onClick={proceedToPayment}
            className="mt-4 w-full bg-[#072679] text-white py-3 rounded-lg font-semibold hover:bg-[#0a2d8d]"
          >
            Continue to Payment
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}



