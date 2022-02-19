export interface StrapiCollectionResponseWrapper<T> {
  data: Array<ResponseObject<T>>;
}

export interface StrapiSingleResponseWrapper<T> {
  data: ResponseObject<T>;
}
export interface ResponseObject<T> {
  id: number;
  attributes: T;
}
