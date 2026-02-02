import { Controller, Get, Header, Res } from '@nestjs/common';
import { join } from 'path';
import type { Response } from 'express';

@Controller('test')
export class TestController {
  @Get('users')
  @Header('Content-Type', 'text/html')
  getTestPage(@Res() res: Response): void {
    const filePath = join(process.cwd(), 'public', 'test', 'users.html');
    res.sendFile(filePath);
  }
}
