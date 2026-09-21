const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');

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