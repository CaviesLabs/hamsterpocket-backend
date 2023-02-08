import { ArgumentsHost, Catch, ContextType, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { AxiosError } from 'axios';
import { ValidationError } from 'class-validator';
import { FastifyRequest, FastifyReply } from 'fastify';

interface IError {
  statusCode: number | string;
  message: string;
  error: string;
}

class ExceptionResponseBuilder {
  private readonly type: ContextType;
  private request?: FastifyRequest;
  statusCode?: HttpStatus | string | number;
  error?: any;
  errorType?: any;
  message?: any;

  constructor(host: ArgumentsHost) {
    /** Extracting contexts */
    this.type = host.getType();
    switch (this.type) {
      case 'http':
        const httpCtx = host.switchToHttp();
        this.request = httpCtx.getRequest();
        break;
    }
  }

  public fromAxiosError(exception: AxiosError): ExceptionResponseBuilder {
    this.error = exception.response.statusText;
    this.message = exception.response.data;
    this.statusCode = exception.response.status;
    return this;
  }

  public fromClassValidator(exception: ValidationError[]): ExceptionResponseBuilder {
    const errors = [];
    exception.forEach(({ constraints }) => {
      errors.push(...Object.values(constraints));
    });

    this.error = 'Bad Request';
    this.message = errors;
    this.statusCode = HttpStatus.BAD_REQUEST;
    return this;
  }

  public fromOthers(exception: HttpException): ExceptionResponseBuilder {
    try {
      const error = exception.getResponse() as IError;
      this.statusCode = error.statusCode;
      this.error = error.error;
      this.message = error.message;
    } catch (e) {
      this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      this.message = exception.message;
      this.error = exception.name;
    }
    return this;
  }

  public detectException(exception: any): ExceptionResponseBuilder {
    /**Get one sample */
    let sample: any;
    if (Array.isArray(exception)) {
      sample = exception[0];
    } else {
      sample = exception;
    }

    /** Handle Class Validator exception */
    if (sample instanceof ValidationError) {
      return this.fromClassValidator(exception);
    }

    /** Handle Axios exception */
    if ((sample as AxiosError).isAxiosError) {
      return this.fromAxiosError(exception as AxiosError);
    }

    /** Handle other errors */
    return this.fromOthers(exception);
  }

  /**
   * @description Get exception response message method
   * @returns ExceptionResponse
   */
  getResponseMessage() {
    switch (this.type) {
      case 'http':
        return {
          statusCode: this.statusCode,
          path: this.request.url,
          errorType: this.error,
          message: this.message,
        };
    }
  }
}

/**
 * Handle exception filter and builder.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    /** response builder */
    const error = new ExceptionResponseBuilder(host).detectException(exception);

    /** Log if internal error */
    if (error.statusCode == HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    /** Return response */
    const response = ctx.getResponse<FastifyReply>();
    response.status(+error.statusCode).send(error.getResponseMessage());
  }
}
