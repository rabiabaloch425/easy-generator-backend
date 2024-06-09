import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import * as password from 'password-hash-and-salt';

@ApiTags('auth')
@Controller('register')
export class AuthRegisterController {
  constructor(@InjectModel('User') private userModel: Model<any>) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        name: { type: 'string' },
        password: { type: 'string' },
        roles: { type: 'array', items: { type: 'string' } },
      },
      required: ['email', 'name', 'password', 'roles'],
    },
  })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(
    @Body('email') email: string,
    @Body('password') plaintextPassword: string,
    @Body('name') name: string,
    @Body('roles') roles: string[]
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
          return reject(new BadRequestException('Email already exists, try with another email.'));
        }

        if (!this.isValidPassword(plaintextPassword)) {
          return reject(
            new BadRequestException(
              'Password must be at least 8 characters long and include at least one number, one letter, and one special character.'
            )
          );
        }

        password(plaintextPassword).hash(async (error, hash) => {
          if (error) {
            console.log('Error hashing password: ', error);
            return reject(error);
          }

          const user = new this.userModel({
            name,
            email,
            roles,
            passwordHash: hash,
          });

          try {
            await user.save();
            resolve({ status: 'ok', user });
          } catch (error) {
            console.log('Error saving user: ', error);
            reject(error);
          }
        });
      } catch (error) {
        console.log('Error checking existing user: ', error);
        reject(error);
      }
    });
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return passwordRegex.test(password);
  }
}
