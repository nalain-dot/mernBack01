import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const token = req.headers.token;

  console.log("Received token in middleware:", token); // Log token

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized! Login Again' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken); // Log decoded token
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ success: false, message: 'Invalid Token' });
  }
};

export default authUser;





