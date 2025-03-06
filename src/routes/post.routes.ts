import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth';
import { createPostSchema, postIdSchema, updatePostSchema } from '../validators/post.validator';
import { ROUTES } from '../constants/route.constants';

const router = Router();
const postController = new PostController();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve posts by user ID
 *     tags: [Public Posts]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved posts
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
 *                     $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing or invalid userId
 */
router.get(ROUTES.POST.BASE, postController.getPostsByUserId);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retrieve a post by ID
 *     tags: [Public Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the post
 *     responses:
 *       200:
 *         description: Successfully retrieved post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid post ID format
 */
router.get(ROUTES.POST.BY_ID, validate(postIdSchema, 'params'), postController.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post for the authenticated user
 *     tags: [Authenticated Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       201:
 *         description: Post successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized - JWT token required
 *       400:
 *         description: Invalid input
 *       429:
 *         description: Too many requests
 */
router.post(
  ROUTES.POST.BASE,
  authMiddleware,
  validate(createPostSchema),
  postController.createPost,
);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update an existing post
 *     tags: [Authenticated Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePost'
 *     responses:
 *       200:
 *         description: Post successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid input or ID format
 *       429:
 *         description: Too many requests
 */
router.patch(
  ROUTES.POST.BY_ID,
  authMiddleware,
  validate(postIdSchema, 'params'),
  validate(updatePostSchema, 'body'),
  postController.updatePost,
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Authenticated Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the post
 *     responses:
 *       204:
 *         description: Post successfully deleted
 *       401:
 *         description: Unauthorized - JWT token required
 *       403:
 *         description: Forbidden - User is not the post owner
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid post ID format
 *       429:
 *         description: Too many requests
 */
router.delete(
  ROUTES.POST.BY_ID,
  authMiddleware,
  validate(postIdSchema, 'params'),
  postController.deletePost,
);

export default router;
