import { message } from "antd"; 
import axios from "axios";
import { NavigateFunction } from "react-router-dom";

export const axiosClient = (token: string, navigate?: NavigateFunction, disabledErrorHandler?: boolean) => {
  const instance = axios.create({
    headers: {
      "content-type": "application/json",
    },
  });
  instance.interceptors.request.use(
    async function (config) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    async function (error) {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    (response) => {
      //message.success("Success"); //xử lý success ở đây ko đc vì ko xác định đc method của request, nên phải xử lý bên gọi hàm
      return response;
    },
    (error) => {
      const status = error.response.data.statusCode;
      const responseMessage = error.response.data.message;
      console.log(error.response);
      return error.response;
    }
  );
  return instance;
};
