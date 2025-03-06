import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth';
import {
  createAddressSchema,
  updateAddressSchema,
  addressIdSchema,
} from '../validators/address.validator';
import { ROUTES } from '../constants/route.constants';

const router = Router();
const addressController = new AddressController();

/**
 * @swagger
 * /addresses/{userId}:
 *   get:
 *     summary: Retrieve an address by user ID
 *     tags: [Public Addresses]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address or user not found
 *       400:
 *         description: Invalid user ID format
 */
router.get(
  ROUTES.ADDRESS.BY_USER_ID,
  validate(addressIdSchema, 'params'),
  addressController.getAddressByUserId,
);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Create an address for the authenticated user
 *     tags: [Authenticated Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAddress'
 *     responses:
 *       201:
 *         description: Address successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid input or user already has an address
 *       401:
 *         description: Unauthorized - JWT token required
 *       429:
 *         description: Too many requests
 */
router.post(
  ROUTES.ADDRESS.BASE,
  authMiddleware,
  validate(createAddressSchema),
  addressController.createAddress,
);

/**
 * @swagger
 * /addresses/{userId}:
 *   patch:
 *     summary: Update an address for the authenticated user
 *     tags: [Authenticated Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *             $ref: '#/components/schemas/UpdateAddress'
 *     responses:
 *       200:
 *         description: Address successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: Address or user not found
 *       400:
 *         description: Invalid input or ID format
 *       429:
 *         description: Too many requests
 */
router.patch(
  ROUTES.ADDRESS.BY_USER_ID,
  authMiddleware,
  validate(addressIdSchema, 'params'),
  validate(updateAddressSchema),
  addressController.updateAddress,
);

/**
 * @swagger
 * /addresses/{userId}:
 *   delete:
 *     summary: Delete an address for the authenticated user
 *     tags: [Authenticated Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *     responses:
 *       204:
 *         description: Address successfully deleted
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: Address or user not found
 *       400:
 *         description: Invalid user ID format
 *       429:
 *         description: Too many requests
 */
router.delete(
  ROUTES.ADDRESS.BY_USER_ID,
  authMiddleware,
  validate(addressIdSchema, 'params'),
  addressController.deleteAddress,
);

export default router;
