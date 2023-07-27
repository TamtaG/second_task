type ParsedQs = any;

export default interface HttpRequestQuery {
  [key: string]: string | string[] | ParsedQs | ParsedQs[];
}
