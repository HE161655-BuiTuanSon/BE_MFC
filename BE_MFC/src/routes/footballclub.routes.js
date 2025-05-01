import express from "express";
import { checkRole, checkClubRole } from "../middlewares/role.middleware.js";
import { createFootballClub } from "../controllers/footballclub.controller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

/**
 * @swagger
 * /footballclub/create:
 *   post:
 *     summary: Tạo một câu lạc bộ bóng đá mới
 *     tags:
 *       - FootballClub
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên câu lạc bộ
 *               founded:
 *                 type: string
 *                 description: Thời gian thành lập câu lạc bộ
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh logo câu lạc bộ
 *     responses:
 *       201:
 *         description: Tạo câu lạc bộ thành công
 *       400:
 *         description: Bad Request, thông tin không hợp lệ
 *       401:
 *         description: Unauthorized, cần cung cấp token hợp lệ
 *       403:
 *         description: Forbidden, không đủ quyền truy cập
 *       500:
 *         description: Lỗi server
 */

router.post(
  "/create",
  upload.single("file"),
  checkRole("Admin"), //Admin , Player
  // checkClubRole("header", "Captain"), //Captain, Player, Treasurer
  createFootballClub
);

export default router;
