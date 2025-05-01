import express from "express";
import jwt from "jsonwebtoken";
import { getAllUsers } from "../controllers/user.controller.js";
import { checkRole } from "../middlewares/role.middleware.js";
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy tất cả người dùng
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # Yêu cầu Bearer token cho route này
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách người dùng
 *       401:
 *         description: Unauthorized, cần cung cấp token hợp lệ
 *       403:
 *         description: Forbidden, không đủ quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/users", checkRole(1, 2), getAllUsers); //role 1 = admin, 2 = player, 3 = captain, 4 = treasurer

export default router;
