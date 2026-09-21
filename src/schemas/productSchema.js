const { z } = require('zod');

const createProductSchema = z.object({
  title: z.string({ required_error: 'El título es obligatorio' }),
  description: z.string({ required_error: 'La descripción es obligatoria' }),
  price: z.number({ required_error: 'El precio es obligatorio' }).positive('El precio debe ser un número positivo'),
  categoryId: z.number({ required_error: 'La categoría es obligatoria' }),
  imageUrl: z.string().url('Debe ser una URL válida').optional(), // <-- Permite enviar la URL obtenida en /api/upload
});

module.exports = { createProductSchema };