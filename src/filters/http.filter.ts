import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

       catch(exception: HttpException, host: ArgumentsHost) {
           console.log("Http exception handler triggered", JSON.stringify(exception));

           const ctx = host.switchToHttp();

           const response = ctx.getResponse();
           const request = ctx.getRequest();
           const statusCode = exception.getStatus();

           return response.status(statusCode).json({
            status: statusCode,
            createdBy: "HttpExceptionFilter",
            errorMessage: exception.message
           })
       }
}