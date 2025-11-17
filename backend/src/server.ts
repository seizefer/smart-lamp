import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import alarmRoutes from './routes/alarmRoutes';
import lightRoutes from './routes/lightRoutes';
import sleepRoutes from './routes/sleepRoutes';
import weatherRoutes from './routes/weatherRoutes';
import { initializeScheduler } from './services/scheduler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/alarms', alarmRoutes);
app.use('/api/lights', lightRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('light:control', (data) => {
    // Broadcast light control to all connected clients
    io.emit('light:update', data);
  });

  socket.on('alarm:trigger', (data) => {
    // Broadcast alarm trigger to all connected clients
    io.emit('alarm:triggered', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize scheduler for alarm notifications
initializeScheduler(io);

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(port, () => {
  console.log(`⚡️ Server running on port ${port}`);
});
