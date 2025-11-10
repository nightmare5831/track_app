import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const Request = {
  async Get(url: string) {
    const response = await axiosInstance.get(url);
    return response.data;
  },

  async Post(url: string, data: any) {
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  async Put(url: string, data: any) {
    const response = await axiosInstance.put(url, data);
    return response.data;
  },

  async Delete(url: string) {
    const response = await axiosInstance.delete(url);
    return response.data;
  },
};

export default Request;
