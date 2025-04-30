import express from "express";
import passport from "passport";
import {
  loginAdmin,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
const router = express.Router();
/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Chuyển hướng người dùng sang đăng nhập Facebook
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect đến Facebook
 */

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Facebook callback sau khi xác thực
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Lỗi xác thực
 */
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    res.json({
      message: "Login successful",
      user: req.user,
      token: req.user.token,
    });
  }
);
/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Đăng nhập tài khoản admin bằng email và mật khẩu
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai mật khẩu
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Email không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/admin/login", loginAdmin);
/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: Access token cần được làm mới
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token để làm mới access token
 *     responses:
 *       200:
 *         description: Thành công, trả về access token mới
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   example: <new-access-token>
 *       400:
 *         description: Cần truyền cả access token và refresh token
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Token đã hết hạn hoặc sai
 */
router.post("/refresh-token", refreshAccessToken);

export default router;
