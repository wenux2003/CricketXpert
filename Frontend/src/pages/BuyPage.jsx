import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BuyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialProduct = location.state?.product;
  const initialQty = location.state?.quantity ?? 1;

  const [quantity, setQuantity] = useState(initialQty > 0 ? initialQty : 1);

  useEffect(() => {
    if (!initialProduct) {
      navigate('/products');
    }
  }, [initialProduct, navigate]);

  const product = initialProduct || {};

  const totalPrice = useMemo(() => {
    const price = Number(product.price) || 0;
    return price * (Number(quantity) || 1);
  }, [product.price, quantity]);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const goToDelivery = () => {
    const subtotal = (Number(product.price) || 0) * (Number(quantity) || 1);
    const deliveryFee = 450;
    const total = subtotal + deliveryFee;
    const cart = [
      {
        productId: product._id,
        quantity,
        priceAtOrder: Number(product.price) || 0,
      },
    ];
    const totalData = { subtotal, deliveryFee, total };
    navigate('/delivery', { state: { cart, totalData } });
  };

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C]">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-full">
              <img
                src={product.image_url || 'https://placehold.co/600x500'}
                alt={product.name || 'Product'}
                className="w-full h-80 object-cover"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x500'; }}
              />
            </div>

            <div className="p-6">
              <h1 className="text-2xl font-bold text-[#000000] mb-2">{product.name || 'Product'}</h1>
              <p className="text-sm text-gray-600 mb-4">{product.description || 'No description available.'}</p>
              <p className="text-lg font-semibold text-[#072679] mb-6">LKR {Number(product.price) || 0}</p>

              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={decrement}
                  className="bg-[#D88717] text-white px-3 py-1 rounded hover:bg-[#B36F14]"
                >
                  -
                </button>
                <span className="text-[#000000] font-medium">{quantity}</span>
                <button
                  onClick={increment}
                  className="bg-[#42ADF5] text-white px-3 py-1 rounded hover:bg-[#2C8ED1]"
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#000000]">Subtotal</span>
                <span className="text-[#072679] font-semibold">LKR {totalPrice}</span>
              </div>

              <button
                onClick={goToDelivery}
                className="mt-6 w-full bg-[#072679] text-white py-3 rounded-lg font-semibold hover:bg-[#0a2d8d]"
              >
                Next: Delivery
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


