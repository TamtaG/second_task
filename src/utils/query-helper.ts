import { Request } from 'express';
import { QueryType } from 'src/common/enum/query-type.enum';
import {
  FindOperator,
  IsNull,
  Like,
  Not,
  ObjectLiteral,
  OrderByCondition,
} from 'typeorm';

import {
  CommonQueryInterface,
  HttpRequestQuery,
  PaginationOptionsI,
} from './interfaces';
import QueryInterface from './interfaces/query.interface';

const typeTransformer = (
  value: string,
  type: QueryType,
): string | number | FindOperator<string> => {
  switch (type) {
    case QueryType.number:
      return Number(value);
    case QueryType.like:
      return Like(`%${value}%`);
    case QueryType.exists:
      return Not(IsNull());
    default:
      return String(value);
  }
};

const getPaginationOptions = (query: HttpRequestQuery): PaginationOptionsI => {
  const skip = query.skip ?? '0';

  const limit = query.limit === 'none' ? 100000 : parseInt(query.limit ?? '4');

  return {
    skip: parseInt(skip, 10),
    limit,
  };
};

const getSortOptions = (
  query: HttpRequestQuery,
  queryOptions: QueryInterface,
  alias: string,
): OrderByCondition => {
  const sortOptions: OrderByCondition = {};

  if (!query.sort) return { [`${alias}.createdAt`]: 'DESC' };

  const sortColumns = query.sort.split(',');

  const finalSortOptions: OrderByCondition = sortColumns.reduce((acc, curr) => {
    let sortKey = curr.split(':')[0];
    const sortDirection = curr.split(':')[1];

    if (!queryOptions[sortKey]?.sort) return acc;

    sortKey = queryOptions[sortKey].replacementKey ?? sortKey;

    if (!sortKey.includes('.')) {
      sortKey = `${alias}.${sortKey}`;
    }

    return { ...acc, [sortKey]: sortDirection.toLocaleUpperCase() };
  }, {});

  return { ...sortOptions, ...finalSortOptions };
};

const getSearchOptions = (
  query: HttpRequestQuery,
  queryOptions: QueryInterface,
): ObjectLiteral => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { skip, limit, sort, alias, ...search } = query;

  const searchOptions = {};

  for (const key in search) {
    const searchOption = queryOptions[key]?.search;
    const typeOption = queryOptions[key]?.type;

    if (!searchOption) continue;
    const searchKey = queryOptions[key].replacementKey ?? key;

    const value = typeTransformer(search[key], typeOption);

    const [first, ...rest] = searchKey.split('.');

    if (searchKey.includes('.')) {
      const obj = rest.reverse().reduce(
        (acc, curr) => {
          if (acc.initialValue) return { [curr]: acc.initialValue };
          return { [curr]: acc };
        },
        { initialValue: value },
      );
      searchOptions[first] = obj;
    } else {
      searchOptions[searchKey] = value;
    }
  }

  return searchOptions;
};

const getQueryOptions = (
  req: Request,
  queryOptions: QueryInterface,
  alias: string,
): CommonQueryInterface => ({
  search: getSearchOptions(req.query, queryOptions),
  sort: getSortOptions(req.query, queryOptions, alias),
  pagination: getPaginationOptions(req.query),
});

export default {
  getPaginationOptions,
  getSortOptions,
  getSearchOptions,
  getQueryOptions,
};
