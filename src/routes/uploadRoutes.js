const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Endpoints para la carga y gestión de archivos multimedia
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Subir una imagen al servidor
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen a cargar
 *     responses:
 *       201:
 *         description: Imagen subida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagen subida correctamente
 *                 imageUrl:
 *                   type: string
 *                   example: https://marketplace-backend-2kcd.onrender.com/uploads/123456789.png
 *       400:
 *         description: No se proporcionó ningún archivo de imagen
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Debes seleccionar un archivo de imagen' });
  }

  // Generar URL accesible
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(201).json({
    message: 'Imagen subida correctamente',
    imageUrl: imageUrl,
  });
});

module.exports = router;