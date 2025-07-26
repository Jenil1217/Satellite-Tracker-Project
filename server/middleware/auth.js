const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  console.log("🔍 === AUTHENTICATION DEBUG ===");
  console.log("1. Authorization header:", req.header("Authorization"));
  
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("2. Extracted token:", token ? "✅ Present" : "❌ Missing");
  
  if (!token) {
    console.log("❌ FAILED: No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || '12345';
    console.log("3. JWT_SECRET being used:", JWT_SECRET);
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("4. ✅ Token decoded successfully:", decoded);
    
    const user = await User.findById(decoded.id);
    console.log("5. Database query for user ID:", decoded.id);
    console.log("6. User found:", user ? `✅ ${user.username}` : "❌ Not found");
    
    if (!user) {
      console.log("❌ FAILED: User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    console.log("7. ✅ Authentication successful, proceeding...");
    next();
  } catch (err) {
    console.log("❌ FAILED: Token verification error:", err.message);
    console.log("Error details:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;