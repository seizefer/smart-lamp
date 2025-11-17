import cron from 'node-cron';
import { Server } from 'socket.io';

export function initializeScheduler(io: Server) {
  // Check for alarms every minute
  cron.schedule('* * * * *', () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    // In production, fetch alarms from database
    // For now, this is a placeholder that clients can listen to
    console.log(`Checking alarms at ${currentTime}`);

    // Emit a check event that clients can use
    io.emit('alarm:check', {
      currentTime,
      timestamp: now.toISOString()
    });
  });

  console.log('Alarm scheduler initialized');
}
