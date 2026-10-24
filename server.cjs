const express = require('express');
const http = require('http');
const { Pool } = require('pg');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get('/orders', async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, items, status FROM orders WHERE status != 'completed' ORDER BY id"
    );

    res.json(result.rows.map((order) => ({
      ...order,
      id: Number(order.id),
    })));
  } catch (error) {
    console.error('Could not get orders', error);
    res.status(500).json({ error: 'Could not get orders' });
  }
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('1 device connected (Kiosk or Kitchen)');

    socket.on('new_order', async (order, acknowledge) => {
  try {
    await pool.query(
      'INSERT INTO orders (id, items) VALUES ($1, $2)',
      [order.id, JSON.stringify(order.items)]
    );

    console.log('Order saved:', order);
    io.emit('display_order', order);
    acknowledge?.({ ok: true });
  } catch (error) {
    console.error('Order could not be saved:', error);
    acknowledge?.({ ok: false, error: 'Order could not be saved' });
  }
});

socket.on('complete_order', async (orderId, acknowledge) => {
  try {
    const result = await pool.query(
      "UPDATE orders SET status = 'completed' WHERE id = $1 RETURNING id",
      [orderId]
    );

    if (result.rowCount === 0) {
      acknowledge?.({ ok: false, error: 'Order not found' });
      return;
    }

    io.emit('order_completed', Number(result.rows[0].id));
    acknowledge?.({ ok: true });
  } catch (error) {
    console.error('Could not finish order', error);
    acknowledge?.({ ok: false, error: 'Could not finish order' });
  }
});
});

server.listen(4000, '0.0.0.0', () => {
    console.log('Server running on port 4000');
});