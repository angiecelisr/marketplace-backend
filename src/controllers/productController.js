const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los productos
// Obtener productos con filtros y paginación
const getProducts = async (req, res, next) => {
  try {
    const { categoryId, search } = req.query;

    // Construir filtro dinámico
    const where = {};

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};


// Obtener un producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const { title, description, price, imageUrl, categoryId } = req.body;

  // Extrae el ID probando ambas nomenclaturas posibles (id o userId)
  const rawUserId = req.user?.id || req.user?.userId;

  if (!rawUserId) {
    return res.status(400).json({ error: 'No se pudo obtener el ID del usuario desde el token JWT' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId: parseInt(categoryId),
        userId: parseInt(rawUserId),
      },
    });
    res.status(201).json({ message: 'Producto creado exitosamente', product });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto', details: error.message });
  }
};
// Actualizar un producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, imageUrl, categoryId } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      },
    });
    res.json({ message: 'Producto actualizado exitosamente', product });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};