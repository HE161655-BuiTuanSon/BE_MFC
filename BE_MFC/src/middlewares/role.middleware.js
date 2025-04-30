import { db } from "../models/index.js";
import jwt from "jsonwebtoken";

// Middleware kiểm tra role của người dùng
export const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token không hợp lệ." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kiểm tra xem người dùng có tồn tại không
      const user = await db.User.findByPk(decoded.id);
      if (!user || !user.is_active) {
        return res.status(403).json({
          success: false,
          message: "Token không hợp lệ hoặc người dùng không hoạt động.",
        });
      }

      // Kiểm tra quyền người dùng (so sánh role_id của người dùng với role yêu cầu)
      if (user.role_id !== requiredRole) {
        return res
          .status(403)
          .json({ success: false, message: "Không đủ quyền truy cập." });
      }

      // Nếu có quyền truy cập, tiếp tục
      req.user = user; // Đảm bảo thông tin người dùng có thể sử dụng trong route
      next();
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi server.", error: err.message });
    }
  };
};
