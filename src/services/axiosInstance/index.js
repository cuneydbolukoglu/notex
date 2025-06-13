import axios from "axios";
import utils from '@/utils';
import Router from "next/router";
import { triggerGlobalError } from "@/utils/errorManager";

const API = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

const axiosInstance = axios.create({
  baseURL: API,
});

// Request Interceptor (Otomatik auth ekleme)
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = utils.cookieManager.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.params = { ...config.params, auth: token };
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor (401 Hatası Alınca Login Sayfasına Gönder)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Yetkisiz erişim! Kullanıcı giriş ekranına yönlendiriliyor...");
      utils.cookieManager.delete("token");
      Router.push("/auth/login");
    }
    if (typeof error.response.data.error == 'string') {
      triggerGlobalError(error.response.data.error);
    } else triggerGlobalError(error.response.data.error.message);
    return console.log(error) //Promise.reject(error);
  }
);

export default axiosInstance;