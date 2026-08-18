import { AxiosRequestConfig } from 'axios';
import apiClient from './axios';

// apiClient's baseURL already includes '/api' (see api/axios.ts).
// The OpenAPI spec's paths also start with '/api/...' (from your
// [Route("api/[controller]")] convention), so passing the generated
// path straight through would double it up: /api/api/Auth/login.
// Strip the leading /api here so the two don't stack.
const stripDuplicateApiPrefix = (url?: string) =>
  url?.startsWith('/api/') ? url.slice(4) : url;

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return apiClient({
    ...config,
    url: stripDuplicateApiPrefix(config.url),
  }).then((response) => response.data);
};

export default axiosInstance;
