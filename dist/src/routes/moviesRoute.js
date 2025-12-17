"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moviesController_1 = __importDefault(require("../controllers/moviesController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /movie:
 *   get:
 *     tags: [Movies]
 *     summary: Get all movies
 *     description: Retrieve a list of all movies in the database
 *     responses:
 *       200:
 *         description: List of movies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 title: "The Matrix"
 *                 year: 1999
 *                 creatredBy: "507f1f77bcf86cd799439012"
 *               - _id: "507f1f77bcf86cd799439013"
 *                 title: "Inception"
 *                 year: 2010
 *                 creatredBy: "507f1f77bcf86cd799439012"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", moviesController_1.default.getAll.bind(moviesController_1.default));
/**
 * @swagger
 * /movie/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Get movie by ID
 *     description: Retrieve a specific movie by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Movie retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Movie not found"
 *       400:
 *         description: Invalid movie ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid movie ID"
 */
router.get("/:id", moviesController_1.default.getById.bind(moviesController_1.default));
/**
 * @swagger
 * /movie:
 *   post:
 *     tags: [Movies]
 *     summary: Create a new movie
 *     description: Create a new movie (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - year
 *             properties:
 *               title:
 *                 type: string
 *                 description: Movie title
 *                 example: "The Matrix"
 *               year:
 *                 type: number
 *                 description: Release year
 *                 example: 1999
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Title and year are required"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Access token required"
 */
router.post("/", authMiddleware_1.authenticate, moviesController_1.default.create.bind(moviesController_1.default));
/**
 * @swagger
 * /movie/{id}:
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie
 *     description: Delete a movie by ID (requires authentication and ownership)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movie deleted successfully"
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Movie not found"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Access token required"
 *       403:
 *         description: Forbidden - Not the movie creator
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "You can only delete movies you created"
 */
router.delete("/:id", authMiddleware_1.authenticate, moviesController_1.default.del.bind(moviesController_1.default));
/**
 * @swagger
 * /movie/{id}:
 *   put:
 *     tags: [Movies]
 *     summary: Update a movie
 *     description: Update a movie by ID (requires authentication and ownership)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Movie title
 *                 example: "The Matrix Reloaded"
 *               year:
 *                 type: number
 *                 description: Release year
 *                 example: 2003
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Movie not found"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Access token required"
 *       403:
 *         description: Forbidden - Not the movie creator
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "You can only update movies you created"
 */
router.put("/:id", authMiddleware_1.authenticate, moviesController_1.default.update.bind(moviesController_1.default));
exports.default = router;
//# sourceMappingURL=moviesRoute.js.map