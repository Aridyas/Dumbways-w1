import jwt from "jsonwebtoken";
import "dotenv/config";

export default function Auth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: Number(decoded.id),
      name: decoded.name
    };

    if (!decoded.id) {
      throw new Error("JWT payload missing user id");
    }

    next();
  } catch (err) {
    return next();
  }
}
