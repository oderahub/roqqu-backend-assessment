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
 *     summary: Get an address by user ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: Address details
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
 *         description: Address not found
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
 *     tags: [Addresses]
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
 *         description: Address created
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
 *         description: Unauthorized
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
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAddress'
 *     responses:
 *       200:
 *         description: Address updated
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
 *         description: Unauthorized
 *       404:
 *         description: Address not found
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
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       204:
 *         description: Address deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.delete(
  ROUTES.ADDRESS.BY_USER_ID,
  authMiddleware,
  validate(addressIdSchema, 'params'),
  addressController.deleteAddress,
);

export default router;
