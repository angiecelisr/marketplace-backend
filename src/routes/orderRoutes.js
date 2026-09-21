const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createOrderSchema } = require('../schemas/orderSchema');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints para la gestión y seguimiento de órdenes
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear una nueva orden de compra
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Petición vacía o datos de orden inválidos
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.post('/', authenticateToken, validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener el historial de órdenes del usuario autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateToken, orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar una orden propia
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a cancelar
 *     responses:
 *       200:
 *         description: Orden cancelada exitosamente
 *       401:
 *         description: Denegado por falta de Token JWT
 *       404:
 *         description: Orden no encontrada
 */
router.patch('/:id/cancel', authenticateToken, orderController.cancelOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       401:
 *         description: No autorizado
 */
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;