import { db } from "../models/index.js"; // Import db từ index.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email và mật khẩu là bắt buộc.",
      });
    }

    // 2. Tìm user theo email, bao gồm password
    const user = await db.User.findOne({
      where: { email },
      attributes: { include: ["password"] }, // Bỏ qua defaultScope để lấy password
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email không tồn tại.",
      });
    }

    // 3. Kiểm tra quyền admin
    if (user.role_id !== 1) {
      console.log("Role ID của user:", user.role_id);
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập.",
      });
    }

    // 4. Kiểm tra trạng thái tài khoản
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khóa.",
      });
    }

    // 5. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Sai mật khẩu.",
      });
    }

    // 6. Kiểm tra JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET không được thiết lập.");
    }

    // 7. Tạo token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 8. Phản hồi
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role_id: user.role_id,
        },
      },
    });
  } catch (err) {
    console.error("Lỗi loginAdmin:", err);
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development" ? err.message : "Lỗi server.",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { accessToken, refreshToken } = req.body;

  if (!accessToken || !refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Cần truyền cả access token và refresh token.",
    });
  }

  try {
    // Kiểm tra và giải mã refresh token
    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Tìm người dùng từ ID đã giải mã
    const user = await db.User.findByPk(decodedRefresh.id);
    if (!user || !user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ hoặc người dùng không hoạt động.",
      });
    }

    // Kiểm tra access token có hợp lệ không
    try {
      jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Access token không hợp lệ.",
      });
    }

    // Tạo mới Access Token nếu refresh token hợp lệ
    const newAccessToken = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      newAccessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Token hết hạn hoặc sai.",
    });
  }
};
