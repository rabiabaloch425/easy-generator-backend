import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as password from 'password-hash-and-salt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../constants";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller("login")
export class AuthController {

  constructor(@InjectModel("User") private userModel: Model<any>) {}

  @Post()
  @ApiBody({ schema: { properties: { email: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body("email") email: string, @Body('password') plaintextPassword: string){
    const user = await this.userModel.findOne({email});

    if(!user){
        console.log("User doesn't exist on the database")
        throw new UnauthorizedException();
    }

    return new Promise((resolve, reject) =>{
        password(plaintextPassword).verifyAgainst(
            user.passwordHash,
            (err, verified) =>{
                if(!verified){
                    reject(new UnauthorizedException());
                }
                else {
                  const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); 
                  const authJwtToken = jwt.sign({ email, roles: user.roles, exp: expirationTime }, JWT_SECRET);
                  const userData = {
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                  };
                  resolve({
                    authJwtToken,
                    user: userData
                  })
                }
            }
        )

    })
  }
}
