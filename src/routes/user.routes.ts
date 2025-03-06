import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth';
import { createUserSchema, userIdSchema, updateUserSchema } from '../validators/user.validator';
import { ROUTES } from '../constants/route.constants';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a paginated list of users
 *     tags: [Public Users]
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number (0-based)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     pageNumber:
 *                       type: integer
 *                       example: 0
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Invalid query parameters
 */
router.get(ROUTES.USER.BASE, userController.getUsers);

/**
 * @swagger
 * /users/count:
 *   get:
 *     summary: Get the total count of users
 *     tags: [Public Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved user count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 5
 */
router.get(ROUTES.USER.COUNT, userController.getUserCount);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Public Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid user ID format
 */
router.get(ROUTES.USER.BY_ID, validate(userIdSchema, 'params'), userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Public Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or email already exists
 *       429:
 *         description: Too many requests
 */
router.post(ROUTES.USER.BASE, validate(createUserSchema), userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update an existing user
 *     tags: [Authenticated Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid input or ID format
 *       429:
 *         description: Too many requests
 */
router.patch(
  ROUTES.USER.BY_ID,
  authMiddleware,
  validate(userIdSchema, 'params'),
  validate(updateUserSchema, 'body'),
  userController.updateUser,
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Authenticated Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid user ID format
 *       429:
 *         description: Too many requests
 */
router.delete(
  ROUTES.USER.BY_ID,
  authMiddleware,
  validate(userIdSchema, 'params'),
  userController.deleteUser,
);

export default router;
