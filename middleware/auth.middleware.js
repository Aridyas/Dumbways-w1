import jwt from "jsonwebtoken";
import "dotenv/config";

export default function Auth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = Number(decoded.id);
    req.userName = decoded.name;

    if (!decoded.id) {
      throw new Error("JWT payload missing user id");
    }

    next();
  } catch (err) {
    return res.redirect("/login");
  }
}
