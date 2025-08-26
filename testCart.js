const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Adjust path as needed

// Import models
const Product = require('./models/product');
const Cart = require('./models/cart');

async function testModels() {
  await connectDB();

  try {
    // Create sample products
    const product1 = await Product.create({
      productId: "PROD_001",
      name: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      category: "Electronics",
      brand: "TechBrand",
      price: 99.99,
      image_url: "https://example.com/images/headphones.jpg",
      stock_quantity: 50,
      is_active: true
    });

    const product2 = await Product.create({
      productId: "PROD_002",
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracking watch with heart rate monitor",
      category: "Wearables",
      brand: "FitTech",
      price: 199.99,
      image_url: "https://example.com/images/fitness-watch.jpg",
      stock_quantity: 30,
      is_active: true
    });

    const product3 = await Product.create({
      productId: "PROD_003",
      name: "Gaming Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard for gaming",
      category: "Gaming",
      brand: "GameGear",
      price: 79.99,
      image_url: "https://example.com/images/keyboard.jpg",
      stock_quantity: 25,
      is_active: true
    });

    const product4 = await Product.create({
      productId: "PROD_004",
      name: "Smartphone Case",
      description: "Protective case for smartphones with drop protection",
      category: "Accessories",
      brand: "ProtectPro",
      price: 19.99,
      image_url: "https://example.com/images/phone-case.jpg",
      stock_quantity: 100,
      is_active: true
    });

    const product5 = await Product.create({
      productId: "PROD_005",
      name: "Laptop Stand",
      description: "Adjustable aluminum laptop stand for better ergonomics",
      category: "Office",
      brand: "ErgoMax",
      price: 45.99,
      image_url: "https://example.com/images/laptop-stand.jpg",
      stock_quantity: 0, // Out of stock
      is_active: false
    });

    // Create sample carts
    const cart1 = await Cart.create({
      sessionId: "session_user_123",
      items: [
        {
          productId: product1._id,
          quantity: 2,
          priceAtAdd: product1.price
        },
        {
          productId: product3._id,
          quantity: 1,
          priceAtAdd: product3.price
        }
      ],
      totalAmount: (product1.price * 2) + (product3.price * 1)
    });

    const cart2 = await Cart.create({
      sessionId: "session_user_456",
      items: [
        {
          productId: product2._id,
          quantity: 1,
          priceAtAdd: product2.price
        },
        {
          productId: product4._id,
          quantity: 3,
          priceAtAdd: product4.price
        }
      ],
      totalAmount: (product2.price * 1) + (product4.price * 3)
    });

    const cart3 = await Cart.create({
      sessionId: "session_user_789",
      items: [
        {
          productId: product1._id,
          quantity: 1,
          priceAtAdd: product1.price
        }
      ],
      totalAmount: product1.price * 1
    });

    console.log("✅ Sample data inserted successfully!");
    console.log("\n📦 Products created:", {
      product1: { id: product1._id, name: product1.name, price: product1.price },
      product2: { id: product2._id, name: product2.name, price: product2.price },
      product3: { id: product3._id, name: product3.name, price: product3.price },
      product4: { id: product4._id, name: product4.name, price: product4.price },
      product5: { id: product5._id, name: product5.name, price: product5.price }
    });

    console.log("\n🛒 Carts created:");
    console.log("Cart 1:", {
      sessionId: cart1.sessionId,
      itemsCount: cart1.items.length,
      totalAmount: cart1.totalAmount
    });
    console.log("Cart 2:", {
      sessionId: cart2.sessionId,
      itemsCount: cart2.items.length,
      totalAmount: cart2.totalAmount
    });
    console.log("Cart 3:", {
      sessionId: cart3.sessionId,
      itemsCount: cart3.items.length,
      totalAmount: cart3.totalAmount
    });

    // Test search functionality
    console.log("\n🔍 Testing search functionality...");
    const searchResults = await Product.find({
      $or: [
        { name: { $regex: "wireless", $options: 'i' } },
        { description: { $regex: "wireless", $options: 'i' } }
      ],
      is_active: true
    });
    console.log("Search results for 'wireless':", searchResults.map(p => p.name));

    // Test category filtering
    const electronicsProducts = await Product.find({ 
      category: "Electronics", 
      is_active: true 
    });
    console.log("Electronics category products:", electronicsProducts.map(p => p.name));

    // Test brand filtering
    const techBrandProducts = await Product.find({ 
      brand: "TechBrand", 
      is_active: true 
    });
    console.log("TechBrand products:", techBrandProducts.map(p => p.name));

    // Test price range filtering
    const affordableProducts = await Product.find({
      price: { $gte: 20, $lte: 100 },
      is_active: true
    });
    console.log("Products between $20-$100:", affordableProducts.map(p => ({ name: p.name, price: p.price })));

    // Test cart population
    console.log("\n🔗 Testing cart population...");
    const populatedCart = await Cart.findOne({ sessionId: "session_user_123" }).populate('items.productId');
    console.log("Populated cart items:", populatedCart.items.map(item => ({
      productName: item.productId.name,
      quantity: item.quantity,
      priceAtAdd: item.priceAtAdd
    })));

  } catch (error) {
    console.error("❌ Error inserting sample data:", error);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Additional function to clear test data
async function clearTestData() {
  await connectDB();
  
  try {
    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log("✅ Test data cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing test data:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testModels();

// Uncomment the line below if you want to clear test data instead
// clearTestData();