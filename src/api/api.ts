import axios from 'axios';
import type { AxiosInstance } from 'axios';

export class ApiGateway {
  private readonly baseUrl = "https://frotavisionapi.onrender.com/api";
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Accept: "application/json", // força parse como JSON
        "Content-Type": "application/json",
      },
    });
    
  }

  async get<T = any>(endPoint: string, params: any = {}): Promise<T> {
    const response = await this.axiosInstance.get<T>(endPoint, { params });
    return response.data;
  }

  async post<T = any>(endPoint: string, data: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(endPoint, data);
    return response.data;
  }

  async put<T = any>(endPoint: string, data: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(endPoint, data);
    return response.data;
  }

  async delete<T = any>(endPoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endPoint);
    return response.data;
  }

  async patch<T = any>(endPoint: string, data: any): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endPoint, data);
    return response.data;
  }
}
