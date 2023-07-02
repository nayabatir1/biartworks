import { Body, Controller, Get, Post, Put, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  SignInDTO,
  SignUpDTO,
  changePasswordDTO,
  changePasswordSchema,
  forgotPasswordDTO,
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
} from './auth.dto';
import { UtilService } from '../util/util.service';
import { Public } from '../public/public.decorator';
import { JoiBodyValidationPipe } from '../joi-validation/joi-body-validation/joi-body-validation.pipe';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('signin')
  @UsePipes(new JoiBodyValidationPipe(signInSchema))
  async signIn(@Body() body: SignInDTO) {
    const data = await this.service.signIn(body);

    return UtilService.buildResponse(data);
  }

  @Public()
  @Post('signup')
  @UsePipes(new JoiBodyValidationPipe(signUpSchema))
  async signUp(@Body() body: SignUpDTO) {
    const data = await this.service.signUp(body);

    return UtilService.buildResponse(data);
  }

  @ApiOperation({ summary: 'get otp in mail' })
  @Public()
  @Post('otp')
  @UsePipes(new JoiBodyValidationPipe(forgotPasswordSchema))
  async forgotPassword(@Body() body: forgotPasswordDTO) {
    await this.service.forgotPassword(body.email);

    return UtilService.buildResponse(null, 'OTP send to email');
  }

  @ApiOperation({ summary: 'change password' })
  @Public()
  @Put('reset-password')
  @UsePipes(new JoiBodyValidationPipe(changePasswordSchema))
  async changePassword(@Body() body: changePasswordDTO) {
    await this.service.changePassword(body);

    return UtilService.buildResponse(null, 'Password updated successfully');
  }
}
