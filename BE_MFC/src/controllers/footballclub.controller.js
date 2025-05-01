import { db } from "../models/index.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import getDriveClient from "../tokens/drive-token.js";

export const createFootballClub = async (req, res) => {
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

    const { name, founded } = req.body;
    const file = req.file;

    if (!name || !founded || !file) {
      return res.status(400).json({
        success: false,
        message:
          "Vui lòng cung cấp đầy đủ tên, thời gian thành lập và ảnh logo.",
      });
    }

    // Upload image to Google Drive
    const drive = await getDriveClient();
    const fileMetadata = {
      name: file.originalname,
      parents: ["1lurtEPZhdMQYNudlUpqDHDBz892YRom2"],
    };
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    // Set public read permission
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const fileUrl = `https://drive.google.com/uc?id=${response.data.id}`;

    // Clean up temporary file
    try {
      fs.unlinkSync(file.path);
    } catch (unlinkError) {
      console.warn(
        "Warning: Failed to delete local file:",
        unlinkError.message
      );
    }

    // Create new FootballClub
    const newClub = await db.FootballClub.create({
      name,
      founded,
      logo_url: fileUrl,
      fund: 0,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo câu lạc bộ thành công.",
      data: newClub,
    });
  } catch (err) {
    console.error("Error creating football club:", err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server.", error: err.message });
  }
};
