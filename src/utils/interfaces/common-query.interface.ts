import { OrderByCondition } from 'typeorm';
import { ObjectLiteral } from 'typeorm';
import PaginationOptionsI from './pagination-options.interface';

export default interface CommonQueryInterface {
  pagination: PaginationOptionsI;
  search: ObjectLiteral;
  sort: OrderByCondition;
}
