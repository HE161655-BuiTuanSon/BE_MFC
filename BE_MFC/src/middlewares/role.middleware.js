import { db } from "../models/index.js";
import jwt from "jsonwebtoken";

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

      // Tìm người dùng và bao gồm vai trò từ bảng UserRoles
      const user = await db.User.findByPk(decoded.id, {
        include: [
          {
            model: db.Role,
            through: { attributes: [] },
          },
        ],
      });

      if (!user || !user.is_active) {
        return res.status(403).json({
          success: false,
          message: "Token không hợp lệ hoặc người dùng không hoạt động.",
        });
      }

      // Lấy danh sách tên vai trò từ bảng UserRoles
      const userRoles = user.Roles.map((role) => role.name);

      // Kiểm tra xem người dùng có vai trò được phép không
      if (!allowedRoles.some((role) => userRoles.includes(role))) {
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

export const checkClubRole = (clubIdSource, ...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token không hợp lệ." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy clubId từ nguồn được chỉ định (query, body, hoặc params)
      let clubId;
      if (clubIdSource === "header") {
        clubId = req.headers["clubid"];
      } else if (clubIdSource === "body") {
        clubId = req.body.clubId;
      } else if (clubIdSource === "params") {
        clubId = req.params.clubId;
      }
      console.log("Club ID:", clubId);
      if (!clubId) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu clubId." });
      }

      // Tìm người dùng
      const user = await db.User.findByPk(decoded.id);
      console.log("User:", user);
      if (!user || !user.is_active) {
        return res.status(403).json({
          success: false,
          message: "Token không hợp lệ hoặc người dùng không hoạt động.",
        });
      }
      clubId = parseInt(clubId, 10);
      if (isNaN(clubId)) {
        return res
          .status(400)
          .json({ success: false, message: "clubId phải là một số hợp lệ." });
      }
      // Tìm vai trò của người dùng trong đội bóng
      const userClubRoles = await db.UserClubRoles.findAll({
        where: {
          userId: user.id,
          clubId: clubId,
        },
        attributes: ["userId", "clubId", "roleId"],
        include: [
          {
            model: db.Role,
            as: "role",
            foreignKey: "roleId",
            attributes: ["name"],
          },
        ],
        raw: true,
      });
      console.log("User club roles:", userClubRoles);
      const rolesInClub = userClubRoles
        .filter((ucr) => ucr["role.name"])
        .map((ucr) => ucr["role.name"]);
      console.log("Roles in club:", rolesInClub);
      console.log("Allowed roles:", allowedRoles);

      // Kiểm tra xem người dùng có vai trò được phép trong đội bóng không
      if (!allowedRoles.some((role) => rolesInClub.includes(role))) {
        return res.status(403).json({
          success: false,
          message: "Không đủ quyền truy cập.",
          userRoles: rolesInClub,
          requiredRoles: allowedRoles,
        });
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
