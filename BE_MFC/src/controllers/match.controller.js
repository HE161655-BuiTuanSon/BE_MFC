import { db } from "../models/index.js";
import fs from "fs";
import jwt from "jsonwebtoken";

export const createMatch = async (req, res) => {
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
    const { home_team, away_team, start_time, stadiumId } = req.body;
    if (!home_team || !away_team || !start_time || !stadiumId) {
      return res.status(400).json({
        success: false,
        message:
          "Vui lòng cung cấp đầy đủ tên đội nhà, tên đội khách, thời gian và sân vận động.",
      });
    }
    const newMatch = await db.Match.create({
      home_team,
      away_team,
      start_time,
      stadiumId,
      status: 1,
    });
    return res.status(201).json({
      success: true,
      message: "Tạo trận đấu thành công.",
      match: newMatch,
    });
  } catch (err) {
    console.error("Error creating football club:", err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server.", error: err.message });
  }
};
