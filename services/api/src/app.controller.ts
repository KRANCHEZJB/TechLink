import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'TechLink API is running!';
  }

  @Get('health')
  getHealth(): object {
    return { 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'TechLink API'
    };
  }
}
