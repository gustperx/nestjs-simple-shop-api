import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User was created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiBearerAuth()
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthService(user);
  }
}
