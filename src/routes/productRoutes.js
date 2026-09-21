const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateSchema = require('../middlewares/validateMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');
const { createProductSchema } = require('../schemas/productSchema');

// 1. Ruta pública para obtener/filtrar productos (Responde 200 OK)
router.get('/', productController.getProducts);

// 2. Ruta protegida para crear productos
router.post(
  '/',
  authenticateToken,
  validateSchema(createProductSchema),
  productController.createProduct
);

module.exports = router;