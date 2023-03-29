/** Define types to be used by Express RESTful API endpoints */

export type ResBody = {
  responseCode: number;
  responseType?: string;
  body: object;
};
