import { api } from './api';

export async function testAPIConnection() {
  try {
    const health = await fetch('http://localhost:4000/api/v1/health');
    const events = await api.getEvents();
    
    return {
      success: true,
      health: await health.json(),
      eventsCount: events.length,
      message: 'Backend connection successful!'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Backend connection failed!'
    };
  }
}

// Also export as default for backward compatibility
export default testAPIConnection;
