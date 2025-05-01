import express from "express";
import { checkRole } from "../middlewares/role.middleware.js";
import { createMatch } from "../controllers/match.controller.js";
const router = express.Router();
/**
 * @swagger
 * /match/create:
 *   post:
 *     summary: Create a new match
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               home_team:
 *                 type: integer
 *                 description: ID of the home team
 *               away_team:
 *                 type: string
 *                 description: Name of the away team
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Match start time (ISO 8601 format)
 *               stadiumId:
 *                 type: integer
 *                 description: ID of the stadium
 *             required:
 *               - home_team
 *               - away_team
 *               - start_time
 *               - stadiumId
 *     responses:
 *       201:
 *         description: Match created successfully
 *       400:
 *         description: Bad request - Missing or invalid data
 *       401:
 *         description: Unauthorized - Invalid token
 *       403:
 *         description: Forbidden - Only captains (role 3) can create matches
 */

router.post("/create", checkRole("Player"), createMatch);

export default router;
