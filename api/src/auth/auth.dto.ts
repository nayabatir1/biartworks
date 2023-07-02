import { ApiProperty, OmitType } from '@nestjs/swagger';
import * as joi from 'joi';

export const signInSchema = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required(),
});

export class SignInDTO {
  @ApiProperty({
    example: 'example@yopmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'pass123',
  })
  password: string;
}

export const signUpSchema = joi.object({
  email: joi.string().trim().email().required(),
  name: joi.string().trim().required(),
  password: joi.string().trim().required(),
  confirmPassword: joi.string().valid(joi.ref('password')),
});

export class SignUpDTO {
  @ApiProperty({
    example: 'daemon@yopmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'jon doe',
  })
  name: string;

  @ApiProperty({
    example: 'pass123',
  })
  password: string;

  @ApiProperty({
    example: 'pass123',
  })
  confirmPassword: string;
}

export const forgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

export class forgotPasswordDTO {
  @ApiProperty({ example: 'waterproof@yopmail.com' })
  email: string;
}

export const changePasswordSchema = signUpSchema.append({
  email: joi.forbidden(),
  name: joi.forbidden(),
  otp: joi.string().required(),
});

export class changePasswordDTO extends OmitType(SignUpDTO, ['name', 'email']) {
  @ApiProperty({
    example: '456789',
  })
  otp: string;
}
