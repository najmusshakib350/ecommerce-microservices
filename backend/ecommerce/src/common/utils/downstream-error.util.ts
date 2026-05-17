import {
  HttpException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AxiosError } from 'axios';

export function rethrowDownstreamError(
  error: unknown,
  fallbackMessage: string,
): never {
  if (error instanceof AxiosError) {
    if (error.response) {
      throw new HttpException(error.response.data, error.response.status);
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new ServiceUnavailableException(fallbackMessage);
    }
  }

  throw new ServiceUnavailableException(fallbackMessage);
}
