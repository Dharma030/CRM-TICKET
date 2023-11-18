const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/mongo.helper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    // Verify the access JWT
    const decoded = await verifyAccessJWT(authorization);

    if (decoded.email) {
      // If the decoded JWT contains an email
     // const userId = await getJWT(authorization);

      if (!userId) {
        // If userId is not found in MongoDB
        return res.status(403).json({ message: "Forbidden" });
      }

      // Attach userId to the request object for future use
      req.userId = userId;

      return next(); // Continue to the next middleware or route handler
    }
  } catch (error) {
    console.error("Error verifying access JWT:", error);
  }

  // If any error occurs during JWT verification, delete the JWT from MongoDB
  deleteJWT(authorization);

  // Return Forbidden status
  return res.status(403).json({ message: "Forbidden" });
};

module.exports = {
  userAuthorization,
};
