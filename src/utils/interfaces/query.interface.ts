import { QueryType } from 'src/common/enum/query-type.enum';

export default interface QueryInterface {
  [key: string]: {
    sort?: boolean;
    search?: boolean;
    type?: QueryType;
    replacementKey?: string;
    filter?: boolean;
  };
}
