export interface ErrorSources {
  path: string;
  message: string;
}
export interface HandlerResponse {
  statusCode: number;
  message: string;
  errorSources?: ErrorSources[];
}
