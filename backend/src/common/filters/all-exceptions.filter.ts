import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? (exception.getResponse() as
          | string
          | { message?: string | string[]; error?: string })
      : undefined;

    let message: string | string[] = 'Unexpected error';
    let error = 'Internal Server Error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      if (exceptionResponse.message) {
        message = exceptionResponse.message;
      }
      if (exceptionResponse.error) {
        error = exceptionResponse.error;
      }
    }
    
    if (typeof response?.status === 'function' && typeof response?.json === 'function') {
      const res = response as { status: (code: number) => { json: (body: unknown) => void } };
      res.status(status).json({
        statusCode: status,
        message,
        error,
        path: request?.url,
        timestamp: new Date().toISOString(),
      });
    } else {
      throw exception;
    }
  }
}

