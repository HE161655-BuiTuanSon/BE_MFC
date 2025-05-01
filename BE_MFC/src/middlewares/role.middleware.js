import { db } from "../models/index.js";
import jwt from "jsonwebtoken";

// Middleware kiểm tra role của người dùng
export const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token không hợp lệ." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await db.User.findByPk(decoded.id);
      if (!user || !user.is_active) {
        return res.status(403).json({
          success: false,
          message: "Token không hợp lệ hoặc người dùng không hoạt động.",
        });
      }

      if (!allowedRoles.includes(user.role_id)) {
        return res
          .status(403)
          .json({ success: false, message: "Không đủ quyền truy cập." });
      }

      req.user = user;
      next();
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi server.", error: err.message });
    }
  };
};
