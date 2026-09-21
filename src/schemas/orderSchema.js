const { z } = require('zod');

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number({ required_error: 'El ID del producto es obligatorio' }).int().positive(),
        quantity: z.number({ required_error: 'La cantidad es obligatoria' }).int().positive('La cantidad debe ser al menos 1'),
      })
    )
    .min(1, 'La orden debe contener al menos un producto'),
});

module.exports = { createOrderSchema };