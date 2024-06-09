import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../constants";
import { Request, Response } from "express";


@Injectable()
export class GetUserMiddleware {
   use(req: Request, res: Response, next: () => void){
      const authJwtToken = req.headers.authorization;

      if(!authJwtToken){
         next();
         return;
      }

      try {
        const user = jwt.verify(authJwtToken, JWT_SECRET)

        if(user){
            console.log("Found user details in Jwt: ", user)

            req["user"] = user;
        }
      }
      catch(err){
        console.log("Error handling authentication JWT: ", err)
      }

      next();


   }
}