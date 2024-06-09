import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersSchema } from "./users.schema";
import { AuthRegisterController } from "./auth.signup.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
           {
            name: "User", schema: UsersSchema
           }
        ])
    ],
   controllers: [
    AuthController,
    AuthRegisterController
   ]
})
export class AuthModule {

}