const express = require('express');
const cors = require('cors');
require('dotenv').config();

const setupSwagger = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = require('./app');

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
  res.send('Servidor Marketplace corriendo correctamente 🚀');
});

app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
