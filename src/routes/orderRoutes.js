const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createOrderSchema } = require('../schemas/orderSchema');

// Crear una nueva orden
router.post('/', authenticateToken, validate(createOrderSchema), orderController.createOrder);

// Obtener órdenes del usuario
router.get('/', authenticateToken, orderController.getUserOrders);

// Cancelar una orden propia
router.patch('/:id/cancel', authenticateToken, orderController.cancelOrder);

// Actualizar estado de una orden
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;