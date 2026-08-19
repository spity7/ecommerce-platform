import axios, { isAxiosError, type AxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "./apiBaseUrl.js";

export { getApiBaseUrl } from "./apiBaseUrl.js";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const platformInstance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

platformInstance.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  return config;
});

platformInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      let message = `Request failed (${status})`;
      const body = error.response?.data as { error?: string } | undefined;
      if (body?.error) {
        message = body.error;
      }
      throw new ApiError(message, status);
    }
    throw error;
  }
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = platformInstance({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error injected at runtime by consumers
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default customInstance;
