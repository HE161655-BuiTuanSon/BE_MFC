import jwt from "jsonwebtoken";
import { db } from "../models/index.js";

export const getAllUsers = async (req, res) => {
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

    const users = await db.User.findAll();
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server.", error: err.message });
  }
};
