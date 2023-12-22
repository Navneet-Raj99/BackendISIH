// authMiddleware.js

const jwt = require('jsonwebtoken');

// Secret key for JWT
const secretKey = 'your_secret_key';

const authenticateUser = (req, res, next) => {
    const token = req.header("auth_token");
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }

    try {
        // Verify the token
        // const decoded = jwt.verify(token, secretKey);
        // console.log(decoded)

        // // Attach user information to the request for later use
        // req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports = authenticateUser;
