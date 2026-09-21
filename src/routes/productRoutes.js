const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateSchema = require('../middlewares/validateMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');
const { createProductSchema } = require('../schemas/productSchema');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión y consulta del catálogo de productos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener y filtrar lista de productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda en nombre o descripción
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Teclado Mecánico RGB
 *               description:
 *                 type: string
 *                 example: Teclado mecánico con switches rojos
 *               price:
 *                 type: number
 *                 example: 89.99
 *               stock:
 *                 type: integer
 *                 example: 15
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *               imageUrl:
 *                 type: string
 *                 example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.post(
  '/',
  authenticateToken,
  validateSchema(createProductSchema),
  productController.createProduct
);

module.exports = router;