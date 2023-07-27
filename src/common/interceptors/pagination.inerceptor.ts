import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import queryHelper from 'src/utils/query-helper';
import QueryInterface from 'src/utils/interfaces/query.interface';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  constructor(private options: QueryInterface, private alias: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = context.switchToHttp().getRequest();

    const pagination = queryHelper.getQueryOptions(
      req,
      this.options,
      this.alias,
    );
    req.pagination = pagination;

    return next.handle();
  }
}
