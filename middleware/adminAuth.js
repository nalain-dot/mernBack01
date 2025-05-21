// adminAuth.js
import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized! Login Again" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET , {expiresIn : '24h'});
    if (decodedToken.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Not Authorized! Login Again" });
    }

    req.admin = decodedToken; // Attach admin data to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export default adminAuth