import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDTO, SignUpDTO, changePasswordDTO } from './auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly mail: EmailService,
  ) {}

  async signIn({ email, password }: SignInDTO) {
    const user = await this.userService.findOne(email);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (!user.password)
      throw new BadRequestException('Please signup to continue');

    if (!user.isActive)
      throw new UnauthorizedException('Access blocked, please contact admin');

    const passMatched = await compare(password, user.password);

    if (!passMatched)
      throw new UnauthorizedException('Invalid email or password');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      groupIds: user.groupIds,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      name: user.name,
      email: user.email,
      role: user.role,
      groupIds: user.groupIds,
    };
  }

  async signUp(body: SignUpDTO) {
    const user = await this.userService.findOne(body.email);

    if (!user) throw new UnauthorizedException('User not invited');

    this.userService.signup(body);

    const payload = { sub: user.id, email: user.email, role: user.role };

    this.mail.sendMail({
      to: body.email,
      subject: 'Link to Signup',
      template: 'confirmation',
      context: {
        name: body.name,
      },
    });

    return {
      token: await this.jwtService.signAsync(payload),
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupIds,
    };
  }

  async forgotPassword(email: string) {
    return this.userService.forgotPassword(email);
  }

  async changePassword(body: changePasswordDTO) {
    return this.userService.changePassword(body);
  }
}
