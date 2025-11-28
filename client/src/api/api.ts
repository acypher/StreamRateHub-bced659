import axios, { AxiosRequestConfig } from 'axios';
import JSONbig from 'json-bigint';

const localApi = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
  transformResponse: [(data) => JSONbig.parse(data)]
});

const api = {
  request: (config: AxiosRequestConfig) => {
    return localApi(config);
  },
  get: (url: string, config?: AxiosRequestConfig) => {
    return localApi.get(url, config);
  },
  post: (url: string, data?: unknown, config?: AxiosRequestConfig) => {
    return localApi.post(url, data, config);
  },
  put: (url: string, data?: unknown, config?: AxiosRequestConfig) => {
    return localApi.put(url, data, config);
  },
  delete: (url: string, config?: AxiosRequestConfig) => {
    return localApi.delete(url, config);
  },
};

export default api;
