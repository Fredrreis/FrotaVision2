import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export class ApiGateway {
  private readonly baseUrl = "https://frotavisionapi.onrender.com/api";
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async get<T = unknown>(endPoint: string, params: Record<string, unknown> = {}, signal?: AbortSignal): Promise<T> {
    const config: AxiosRequestConfig = { params, signal };
    const response = await this.axiosInstance.get<T>(endPoint, config);
    return response.data;
  }

  async post<T = unknown>(endPoint: string, data: unknown, signal?: AbortSignal): Promise<T> {
    const config: AxiosRequestConfig = { signal };
    const response = await this.axiosInstance.post<T>(endPoint, data, config);
    return response.data;
  }

  async put<T = unknown>(endPoint: string, data: unknown, signal?: AbortSignal): Promise<T> {
    const config: AxiosRequestConfig = { signal };
    const response = await this.axiosInstance.put<T>(endPoint, data, config);
    return response.data;
  }

  async delete<T = unknown>(endPoint: string, signal?: AbortSignal): Promise<T> {
    const config: AxiosRequestConfig = { signal };
    const response = await this.axiosInstance.delete<T>(endPoint, config);
    return response.data;
  }

  async patch<T = unknown>(endPoint: string, data: unknown, signal?: AbortSignal): Promise<T> {
    const config: AxiosRequestConfig = { signal };
    const response = await this.axiosInstance.patch<T>(endPoint, data, config);
    return response.data;
  }
}
