const mongoose = require('mongoose');

const uri = "mongodb+srv://wenurarcc:UzrT01RmBYstdtAz@wenux23.qic177q.mongodb.net/?retryWrites=true&w=majority&appName=wenux23";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas!");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
