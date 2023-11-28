export class PagedResult<T> {
  result: T;
  total: number;

  constructor(result: T, total: number) {
    this.result = result;
    this.total = total;
  }
}
