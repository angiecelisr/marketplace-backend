const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrder = async (req, res, next) => {
  try {
    const rawUserId = req.user?.id || req.user?.userId;
    const userId = parseInt(rawUserId);

    // Tomamos productId y quantity del payload o del primer elemento si enviaron un array
    const { productId, quantity, items } = req.body;
    
    // Soporta tanto {"items": [{"productId": 2, "quantity": 2}]} como {"productId": 2, "quantity": 2}
    const targetProductId = productId || (items && items[0]?.productId);
    const targetQuantity = quantity || (items && items[0]?.quantity) || 1;

    if (!targetProductId) {
      return res.status(400).json({ error: 'Debes proporcionar un productId' });
    }

    // Buscar el producto en la base de datos
    const product = await prisma.product.findUnique({
      where: { id: parseInt(targetProductId) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Calcular el total dinámicamente
    const total = product.price * parseInt(targetQuantity);

    // Crear la orden directamente vinculada al producto segun schema.prisma
    const newOrder = await prisma.order.create({
      data: {
        userId,
        productId: product.id,
        total,
        status: 'pending',
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({
      message: 'Orden creada exitosamente',
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const rawUserId = req.user?.id || req.user?.userId;
    const userId = parseInt(rawUserId);

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Cancelar una orden (por parte del cliente)
const cancelOrder = async (req, res, next) => {
  try {
    const rawUserId = req.user?.id || req.user?.userId;
    const userId = parseInt(rawUserId);
    const { id } = req.params;

    // Verificar que la orden exista y pertenezca al usuario
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para cancelar esta orden' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'La orden ya está cancelada' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
    });

    res.json({
      message: 'Orden cancelada exitosamente',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar el estado de una orden (por ejemplo: 'pending', 'shipped', 'completed', 'cancelled')
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'El nuevo estado es requerido' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: status.toLowerCase() },
    });

    res.json({
      message: 'Estado de la orden actualizado exitosamente',
      order: updatedOrder,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
};
